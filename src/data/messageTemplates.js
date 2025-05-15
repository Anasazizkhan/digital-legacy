export const messageTemplates = {
  lifeMoments: {
    graduation: {
      title: "Graduation Message",
      description: "Write a letter before final exams to open after graduation",
      prompts: [
        "What are your hopes and dreams post-graduation?",
        "What advice would you give to your future self?",
        "What are you most proud of achieving?",
      ],
      defaultContent: "Dear Future Graduate Me,\n\nAs I sit here preparing for finals...",
    },
    firstJob: {
      title: "First Job Celebration",
      description: "A message to celebrate landing your first job",
      prompts: [
        "What are your career aspirations?",
        "What kind of professional do you want to become?",
        "What impact do you want to make?",
      ],
      defaultContent: "Dear Future Professional Me,\n\nCongratulations on your first job!",
    },
    birthday: {
      title: "Birthday Time Capsule",
      description: "Annual birthday message to your future self",
      prompts: [
        "What made this year special?",
        "What are your hopes for the next year?",
        "What would you like to remind yourself?",
      ],
      defaultContent: "Dear Next-Year Me,\n\nHappy Birthday! As I write this...",
    },
    anniversary: {
      title: "Anniversary Reflection",
      description: "Letters for future relationship anniversaries",
      prompts: [
        "What makes your relationship special?",
        "What are your favorite memories together?",
        "What dreams do you share for the future?",
      ],
      defaultContent: "Dear Us,\n\nOn this special day...",
    }
  },
  emotionalGrowth: {
    pastReflection: {
      title: "Letters From Past You",
      description: "Reflect on personal growth and changes",
      prompts: [
        "What challenges have you overcome?",
        "How have you grown emotionally?",
        "What wisdom would you share with your future self?",
      ],
      defaultContent: "Dear Future Me,\n\nLooking back on where I am now...",
    },
    mentalHealth: {
      title: "Mental Health Check-in",
      description: "Supportive message for future tough times",
      prompts: [
        "What helps you feel better when you're down?",
        "What are your coping strategies?",
        "What would you like to remind yourself?",
      ],
      defaultContent: "Dear Self,\n\nIf you're reading this during a difficult time...",
    },
    healing: {
      title: "Healing Journey",
      description: "Document your journey through difficult times",
      prompts: [
        "How are you feeling right now?",
        "What helps you stay strong?",
        "What hopes do you have for your future self?",
      ],
      defaultContent: "Dear Healing Self,\n\nI want you to know...",
    },
    promises: {
      title: "Promise Letter",
      description: "Make commitments to your future self",
      prompts: [
        "What promises are you making to yourself?",
        "What changes do you want to see?",
        "How will you hold yourself accountable?",
      ],
      defaultContent: "Dear Future Me,\n\nToday I promise myself...",
    }
  },
  selfImprovement: {
    goals: {
      title: "Goal Check-in",
      description: "Track your progress on personal goals",
      prompts: [
        "What goals are you setting today?",
        "What steps will you take to achieve them?",
        "How will you measure success?",
      ],
      defaultContent: "Dear Goal-Achieving Me,\n\nLet's check on our progress...",
    },
    fitness: {
      title: "Fitness Journey",
      description: "Document your fitness transformation",
      prompts: [
        "What are your fitness goals?",
        "How do you feel at the start?",
        "What motivates you to get healthier?",
      ],
      defaultContent: "Dear Stronger Me,\n\nOn Day 1 of this journey...",
    },
    finance: {
      title: "Financial Goals",
      description: "Track your financial progress",
      prompts: [
        "What are your financial goals?",
        "What habits will you develop?",
        "Where do you want to be financially?",
      ],
      defaultContent: "Dear Future Saver,\n\nLet's talk about our financial journey...",
    },
    learning: {
      title: "Learning Milestones",
      description: "Track your progress in learning new skills",
      prompts: [
        "What are you learning now?",
        "What do you hope to master?",
        "How will you apply these skills?",
      ],
      defaultContent: "Dear Learning Self,\n\nAs a beginner today...",
    }
  },
  travel: {
    preTrip: {
      title: "Pre-Trip Thoughts",
      description: "Capture your expectations before a journey",
      prompts: [
        "What are you most excited about?",
        "What do you hope to learn or experience?",
        "What are your travel goals?",
      ],
      defaultContent: "Dear Traveling Me,\n\nBefore embarking on this adventure...",
    },
    postTrip: {
      title: "Travel Memories",
      description: "Document your travel experiences",
      prompts: [
        "What were the highlights of your trip?",
        "How has this journey changed you?",
        "What memories do you want to preserve?",
      ],
      defaultContent: "Dear Future Me,\n\nReflecting on this amazing journey...",
    },
    bucketList: {
      title: "Travel Bucket List",
      description: "Check in on your travel dreams",
      prompts: [
        "Where do you dream of visiting?",
        "What experiences do you want to have?",
        "How will you make it happen?",
      ],
      defaultContent: "Dear Adventurous Me,\n\nHave you visited these places yet?",
    }
  },
  family: {
    parentsToKids: {
      title: "Parent to Child Letter",
      description: "Messages for your children's future milestones",
      prompts: [
        "What wisdom do you want to share?",
        "What memories do you want to preserve?",
        "What are your hopes for their future?",
      ],
      defaultContent: "Dear [Child's Name],\n\nAs your parent, I want you to know...",
    },
    kidsToParents: {
      title: "Child to Parent Letter",
      description: "Messages from children to their parents",
      prompts: [
        "What do you want to thank them for?",
        "What memories do you cherish?",
        "What do you hope to tell them in the future?",
      ],
      defaultContent: "Dear Mom/Dad,\n\nI want to share something with you...",
    },
    siblingMessages: {
      title: "Sibling Letter",
      description: "Messages between siblings for future milestones",
      prompts: [
        "What makes your sibling relationship special?",
        "What memories do you share?",
        "What do you wish for their future?",
      ],
      defaultContent: "Dear [Sibling's Name],\n\nAs your sibling...",
    },
    legacy: {
      title: "Family Legacy Letter",
      description: "Messages for future generations",
      prompts: [
        "What family stories do you want to preserve?",
        "What values do you want to pass on?",
        "What wisdom would you share?",
      ],
      defaultContent: "To My Future Family,\n\nI want to share our story...",
    }
  },
  social: {
    farewell: {
      title: "Farewell Messages",
      description: "Messages for friends moving away",
      prompts: [
        "What makes your friendship special?",
        "What memories do you cherish?",
        "What wishes do you have for their journey?",
      ],
      defaultContent: "Dear Friend,\n\nAs we prepare to part ways...",
    },
    futureLove: {
      title: "Future Partner Letter",
      description: "Messages for your future spouse",
      prompts: [
        "What kind of partner do you hope to be?",
        "What dreams do you have for your relationship?",
        "What would you like them to know?",
      ],
      defaultContent: "Dear Future Love,\n\nEven though we haven't met yet...",
    },
    longDistance: {
      title: "Long Distance Notes",
      description: "Scheduled messages for long-distance relationships",
      prompts: [
        "What do you miss most?",
        "What makes your connection strong?",
        "What future moments do you look forward to?",
      ],
      defaultContent: "Dear [Name],\n\nEven though we're apart...",
    }
  },
  specialEvents: {
    newYear: {
      title: "New Year Reflection",
      description: "Start-of-year message to end-of-year you",
      prompts: [
        "What are your hopes for this year?",
        "What changes do you want to make?",
        "What would make this year successful?",
      ],
      defaultContent: "Dear End-of-Year Me,\n\nAs this year begins...",
    },
    examPrep: {
      title: "Pre-Exam Motivation",
      description: "Encouragement for important exams",
      prompts: [
        "What are you working towards?",
        "What motivates you to succeed?",
        "What would you tell yourself on exam day?",
      ],
      defaultContent: "Dear Test-Taking Me,\n\nYou've prepared for this...",
    },
    reunion: {
      title: "Reunion Countdown",
      description: "Messages for future reunions",
      prompts: [
        "What memories do you want to revisit?",
        "Who are you excited to see?",
        "What changes do you anticipate?",
      ],
      defaultContent: "Dear Reunion Me,\n\nAs we prepare to meet again...",
    },
    tenYear: {
      title: "10-Year Vision",
      description: "Message to your future self in 10 years",
      prompts: [
        "Where do you see yourself in 10 years?",
        "What dreams do you hope to achieve?",
        "What would surprise your future self?",
      ],
      defaultContent: "Dear 10-Years-Later Me,\n\nI wonder where you are now...",
    }
  },
  creative: {
    famous: {
      title: "If I Become Famous",
      description: "Message to open if you achieve fame",
      prompts: [
        "What would fame mean to you?",
        "What would you want to remember?",
        "What values would you want to maintain?",
      ],
      defaultContent: "Dear Famous Me,\n\nIf you're reading this...",
    },
    future: {
      title: "Message to the Future",
      description: "Time capsule message for the future world",
      prompts: [
        "What's life like today?",
        "What do you think will change?",
        "What should the future know about now?",
      ],
      defaultContent: "Dear Future World,\n\nGreetings from [current year]...",
    },
    random: {
      title: "Random Future Check-in",
      description: "Surprise message for a random future date",
      prompts: [
        "What would surprise your future self?",
        "What would you like to remind yourself?",
        "What questions would you ask?",
      ],
      defaultContent: "Dear Future Me,\n\nSurprise! Here's a message from the past...",
    },
    openWhen: {
      title: "Open When Letters",
      description: "Messages for specific emotional moments",
      prompts: [
        "What would comfort your future self?",
        "What advice would you give?",
        "What memories would help in different situations?",
      ],
      defaultContent: "Dear Self,\n\nIf you're opening this...",
    }
  },
  community: {
    timeCapsule: {
      title: "Group Time Capsule",
      description: "Shared messages for group events",
      prompts: [
        "What makes this group special?",
        "What shared memories do you want to preserve?",
        "What hopes do you have for the group?",
      ],
      defaultContent: "Dear Future Us,\n\nAs we create this time capsule together...",
    }
  }
}; 