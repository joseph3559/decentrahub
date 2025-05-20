DecentraHub 🚀
Empowering Creators. Decentralizing Content.


  ---

🌟 Project Overview
DecentraHub is a decentralized content marketplace meticulously designed to empower creators. It enables them to mint, share, and monetize their diverse digital creations—such as articles, videos, and music—as cutting-edge Smart Media NFTs. By leveraging the robust social graph of Lens Protocol, the enhanced media experiences of Bonsai Smart Media, and seamless onboarding via ConnectKit, DecentraHub offers an innovative, transparent, and autonomous platform for content distribution and creator economy participation.

This project is a submission for the Lens Spring Hackathon.

🎯 The Problem We're Solving
Traditional content platforms often centralize control, leaving creators with diminished ownership, opaque revenue-sharing models, and significant cuts taken by intermediaries. Creators face limitations in how their content is shared, monetized, and are often vulnerable to censorship and a lack of transparency. This centralized paradigm stifles innovation and prevents creators from truly owning and benefiting from their digital assets.

✨ Our Solution: DecentraHub
DecentraHub reimagines the creator economy by placing power back into the hands of creators. We provide a platform where:

True Ownership: Creators mint their content as NFTs on Lens Chain, ensuring verifiable and immutable ownership.

Direct Monetization: Eliminate middlemen. Creators set their terms and receive earnings directly.

Enhanced Social Interaction: Utilize Lens Protocol primitives (profiles, follows, collects) to build and engage with communities directly.

Seamless Onboarding: Integrate ConnectKit for a fast, free, and user-friendly wallet connection and onboarding experience.

Smart Media Capabilities: Leverage Bonsai Smart Media Protocol to create interactive and dynamic NFT experiences (e.g., unlockable content, embedded quizzes, dynamic updates).

Decentralized Storage: Media assets are stored on IPFS, ensuring persistence and censorship resistance.

Transparent Analytics: (Future Goal) Leverage tools like Alchemy to provide transparent on-chain analytics for creators.

For Creators: Full ownership, direct monetization, transparent analytics, and genuine community engagement.
For Consumers: Access to exclusive and verifiable content, direct support for creators, and richer, more authentic digital experiences.

🛠️ How It Works: The DecentraHub Flow
Connect & Choose Your Path:

Users seamlessly connect their wallets using ConnectKit.

Upon first connection, users select their primary role: Creator or Consumer.

This information, along with their wallet address, is registered with the DecentraHub backend.

Profile Setup (Optional but Recommended):

New users (or those with incomplete profiles) are guided to complete their profile with details like name, bio, and social links.

For Creators - Minting Content:

Navigate to the "Mint Content" dashboard.

Select content type (Article, Music, Video, Art).

Fill in details: title, description, tags, price.

Upload media files, which are pinned to IPFS.

Configure Bonsai Smart Media options for interactive features.

The backend processes this information, prepares metadata, and facilitates the minting of the Smart Media NFT on Lens Chain via Bonsai SDK interactions.

(Future/Hackathon Goal) Optionally create a Lens publication (e.g., a Post) automatically for the newly minted NFT.

For Consumers - Discover & Engage:

Explore the public marketplace to discover diverse content.

Filter and sort NFTs by category, price, etc.

View NFT details, interact with Bonsai Smart Media features.

Follow favorite creators (Lens Protocol follow primitive).

Collect NFTs (Lens Protocol collect primitive, if applicable to the NFT type).

Manage their owned assets, bids, and favorites in their personalized "My Marketplace" dashboard.

Social Layer with Lens Protocol:

User profiles are linked to or are Lens Profiles.

Follow/unfollow mechanics.

Content can be published as Lens publications.

Collection of content can be tied to Lens collect actions.

💻 Tech Stack
DecentraHub is built with a modern, robust, and decentralized-first technology stack:

Frontend:

Next.js (React Framework)

Tailwind CSS (Utility-first CSS)

ShadCN/UI (Beautifully designed, accessible UI components)

Framer Motion (Animations)

Lucide Icons (Icons)

Wagmi & Viem (Ethereum interaction)

ConnectKit (Wallet connection)

Sonner (Toast notifications)

Backend:

Node.js

Express.js (Web framework)

TypeScript

PostgreSQL (Relational Database)

Sequelize (ORM for PostgreSQL)

Blockchain & Decentralization:

Lens Protocol: Social graph and primitives.

Lens Chain: Target blockchain for NFT deployment.

Bonsai Smart Media Protocol: For creating interactive and dynamic NFTs.

IPFS: Decentralized storage for media assets (via Pinata for pinning).

Alchemy: RPC provider for interacting with Lens Chain.

Shared:

TypeScript for type safety across frontend and backend.

🚀 Getting Started / How to Run
Follow these instructions to set up and run DecentraHub locally.

Prerequisites
Node.js (v18.19.1 or a version compatible with npm v11.1.0 like ^20.17.0 || >=22.9.0)

npm (v11.1.0 recommended) or yarn

PostgreSQL server installed and running.

Git

1. Clone the Repository
git clone <YOUR_REPOSITORY_URL> # TODO: Replace with your actual repo URL
cd decentrahub

2. Setup Backend
Navigate to the backend directory:

cd backend

a. Install Dependencies:

npm install

b. Environment Variables:
Create a .env file in the backend directory by copying .env.example:

cp .env.example .env

Now, edit the backend/.env file and fill in your actual credentials:

# Server Configuration
PORT=5001
NODE_ENV=development

# PostgreSQL Database Configuration
# Replace with your actual PostgreSQL connection string
# Example: DATABASE_URL="postgresql://your_user:your_password@localhost:5432/decentrahub_db_name"
DATABASE_URL="postgresql://postgres:scott@localhost:5432/decentrahub" # Your provided example

# API Keys & Secrets
ALCHEMY_API_KEY_LENS_CHAIN=YOUR_ALCHEMY_API_KEY_FOR_LENS_CHAIN # Get from Alchemy
BONSAI_API_KEY=YOUR_BONSAI_API_KEY # Get from Bonsai
PINATA_API_KEY=YOUR_PINATA_API_KEY # Get from Pinata for IPFS
PINATA_SECRET_API_KEY=YOUR_PINATA_SECRET_KEY # Get from Pinata for IPFS
JWT_SECRET=YOUR_SUPER_STRONG_RANDOM_JWT_SECRET # Generate a strong secret key

# LENS_ENV=development # or 'production'

Important: Ensure your PostgreSQL server is running and the database specified in DATABASE_URL exists (e.g., decentrahub). Sequelize will attempt to create tables.

c. Start the Backend Server:

npm run dev

The backend should start on http://localhost:5001 (or the port specified in your .env). You should see logs indicating database connection and model synchronization.

3. Setup Frontend
Open a new terminal and navigate to the frontend directory:

cd ../frontend
# (If you are in the backend directory, otherwise navigate to decentrahub/frontend)

a. Install Dependencies:

npm install

b. Environment Variables:
Create a .env.local file in the frontend directory:

touch .env.local

Edit frontend/.env.local and add the following (replace with your actual values):

NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api/v1 # Points to your local backend
NEXT_PUBLIC_ALCHEMY_ID=YOUR_ALCHEMY_ID_FOR_FRONTEND # Your Alchemy API Key (can be same as backend's if for same chain/purpose)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID # Get from WalletConnect Cloud

# Optional: If you have a separate Lens App ID for frontend interactions
# NEXT_PUBLIC_LENS_APP_ID=YOUR_LENS_FRONTEND_APP_ID

c. Start the Frontend Development Server:

npm run dev

The frontend should start on http://localhost:3000.

4. Access DecentraHub
Open your browser and navigate to http://localhost:3000. You should see the DecentraHub landing page. You can now connect your wallet, select a role, and start interacting with the platform.

🎥 Video Demo
[Link to our 5-minute video demo] ---

🔗 Live Demo
[Link to the deployed live demo] ---

📜 License
This project is licensed under the MIT License - see the LICENSE.md file for details (or state "MIT License" if no separate file).
As per the backend/package.json, this project uses the MIT License.

🛣️ Future Roadmap (Post-Hackathon Ideas)
Advanced Smart Media features with Bonsai.

Robust auction mechanisms.

Expanded social features (direct messaging, advanced content discovery).

DAO for community governance.

Mobile application.

Detailed on-chain analytics dashboard for creators.

Support for more content types and blockchain networks.

🙏 Acknowledgments (Optional)
Lens Protocol Team

Bonsai Protocol Team

ConnectKit Team

Alchemy

ShadCN/UI

And all the amazing open-source libraries that made this possible!

Happy Hacking! 🚀
