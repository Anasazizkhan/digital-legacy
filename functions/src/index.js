const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Check for messages to deliver every hour
exports.checkScheduledMessages = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const db = admin.firestore();

    try {
      // Query for scheduled messages that should be delivered
      const messagesQuery = await db
        .collection('messages')
        .where('status', '==', 'scheduled')
        .where('deliveryDate', '<=', now)
        .get();

      const batch = db.batch();
      const notifications = [];

      messagesQuery.forEach((doc) => {
        const message = doc.data();
        
        // Update message status
        batch.update(doc.ref, { 
          status: 'delivered',
          deliveredAt: now 
        });

        // Prepare notification
        notifications.push({
          recipientId: message.recipientId,
          title: 'New Time Capsule Message',
          body: 'A message has been delivered to you',
          data: {
            messageId: doc.id,
            type: 'message_delivery'
          }
        });
      });

      // Commit all updates
      await batch.commit();

      // Send notifications
      for (const notification of notifications) {
        try {
          const userDoc = await db
            .collection('users')
            .doc(notification.recipientId)
            .get();

          if (userDoc.exists && userDoc.data().fcmToken) {
            await admin.messaging().send({
              token: userDoc.data().fcmToken,
              notification: {
                title: notification.title,
                body: notification.body
              },
              data: notification.data
            });
          }
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }

      return { processed: messagesQuery.size };
    } catch (error) {
      console.error('Error processing scheduled messages:', error);
      throw error;
    }
  });

// Handle event-based message delivery
exports.checkEventTriggers = functions.firestore
  .document('events/{eventId}')
  .onCreate(async (snap, context) => {
    const event = snap.data();
    const db = admin.firestore();

    try {
      // Query for messages waiting for this event
      const messagesQuery = await db
        .collection('messages')
        .where('status', '==', 'scheduled')
        .where('deliveryEvent', '==', event.type)
        .where('recipientId', '==', event.userId)
        .get();

      const batch = db.batch();
      const notifications = [];

      messagesQuery.forEach((doc) => {
        const message = doc.data();
        
        // Update message status
        batch.update(doc.ref, { 
          status: 'delivered',
          deliveredAt: admin.firestore.Timestamp.now() 
        });

        // Prepare notification
        notifications.push({
          recipientId: message.recipientId,
          title: 'Event Triggered Message',
          body: 'A message has been delivered for: ' + event.type,
          data: {
            messageId: doc.id,
            type: 'message_delivery',
            eventType: event.type
          }
        });
      });

      // Commit all updates
      await batch.commit();

      // Send notifications
      for (const notification of notifications) {
        try {
          const userDoc = await db
            .collection('users')
            .doc(notification.recipientId)
            .get();

          if (userDoc.exists && userDoc.data().fcmToken) {
            await admin.messaging().send({
              token: userDoc.data().fcmToken,
              notification: {
                title: notification.title,
                body: notification.body
              },
              data: notification.data
            });
          }
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }

      return { processed: messagesQuery.size };
    } catch (error) {
      console.error('Error processing event triggers:', error);
      throw error;
    }
  }); 