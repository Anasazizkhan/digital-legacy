# Digital Legacy System

A modern web application for creating and managing time-locked digital messages and memories. Built with React, Tailwind CSS, and modern web technologies.

## Features

- **Time-Locked Messages**
  - Create text, video, audio, or image messages
  - Set specific dates or milestones for unlocking
  - Support for various unlock conditions (e.g., "when I turn 30", "on graduation")

- **Recipient Management**
  - Send messages to yourself or trusted contacts
  - Invitation-based system for adding recipients
  - Identity verification through email + code on unlock date

- **Secure Storage**
  - End-to-end encryption using WebCrypto
  - Secure vault for all media until unlock date
  - Encryption key management and backup

- **Auto-Delivery System**
  - Automatic message delivery when conditions are met
  - Notifications via email, SMS, or in-app alerts
  - Integration with life events and milestones

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/digital-legacy.git
   cd digital-legacy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Tech Stack

- **Frontend Framework**: React
- **Styling**: Tailwind CSS
- **Animations**: 
  - Framer Motion
  - AOS (Animate On Scroll)
- **Icons**: React Icons
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Project Structure

```
digital-legacy/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── App.jsx        # Main application component
│   └── index.css      # Global styles
├── public/            # Static assets
└── package.json       # Project dependencies
```

## Security Features

- End-to-end encryption for all stored content
- Secure key management
- Identity verification system
- Session management and device control

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of the project
