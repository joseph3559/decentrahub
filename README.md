# DecentraHub 🚀

**Empowering Creators. Decentralizing Content.**

[![Lens Protocol](https://img.shields.io/badge/Built%20on-Lens%20Protocol-brightgreen?style=for-the-badge&logo=lens)](https://lens.xyz/)
[![Bonsai Smart Media](https://img.shields.io/badge/Powered%20by-Bonsai%20Smart%20Media-purple?style=for-the-badge)]() [![ConnectKit](https://img.shields.io/badge/Onboarding%20with-ConnectKit-blue?style=for-the-badge)]() ---

## 🌟 Project Overview

DecentraHub is a decentralized content marketplace meticulously designed to empower creators. It enables them to mint, share, and monetize their diverse digital creations—such as articles, videos, and music—as cutting-edge Smart Media NFTs. By leveraging the robust social graph of **Lens Protocol**, the enhanced media experiences of **Bonsai Smart Media**, and seamless onboarding via **ConnectKit**, DecentraHub offers an innovative, transparent, and autonomous platform for content distribution and creator economy participation.

This project is a submission for the **Lens Spring Hackathon**.

---

## 🎯 The Problem We're Solving

Traditional content platforms often centralize control, leaving creators with diminished ownership, opaque revenue-sharing models, and significant cuts taken by intermediaries. Creators face limitations in how their content is shared, monetized, and are often vulnerable to censorship and a lack of transparency. This centralized paradigm stifles innovation and prevents creators from truly owning and benefiting from their digital assets.

---

## ✨ Our Solution: DecentraHub

DecentraHub reimagines the creator economy by placing power back into the hands of creators. We provide a platform where:

* **True Ownership:** Creators mint their content as NFTs on **Lens Chain**, ensuring verifiable and immutable ownership.
* **Direct Monetization:** Eliminate middlemen. Creators set their terms and receive earnings directly.
* **Enhanced Social Interaction:** Utilize **Lens Protocol** primitives (profiles, follows, collects) to build and engage with communities directly.
* **Seamless Onboarding:** Integrate **ConnectKit** for a fast, free, and user-friendly wallet connection and onboarding experience.
* **Smart Media Capabilities:** Leverage **Bonsai Smart Media Protocol** to create interactive and dynamic NFT experiences (e.g., unlockable content, embedded quizzes, dynamic updates).
* **Decentralized Storage:** Media assets are stored on **IPFS**, ensuring persistence and censorship resistance.
* **Transparent Analytics:** (Future Goal) Leverage tools like Alchemy to provide transparent on-chain analytics for creators.

**For Creators:** Full ownership, direct monetization, transparent analytics, and genuine community engagement.
**For Consumers:** Access to exclusive and verifiable content, direct support for creators, and richer, more authentic digital experiences.

---

## 🛠️ How It Works: The DecentraHub Flow

1.  **Connect & Choose Your Path:**
    * Users seamlessly connect their wallets using **ConnectKit**.
    * Upon first connection, users select their primary role: **Creator** or **Consumer**.
    * This information, along with their wallet address, is registered with the DecentraHub backend.

2.  **Profile Setup (Optional but Recommended):**
    * New users (or those with incomplete profiles) are guided to complete their profile with details like name, bio, and social links.

3.  **For Creators - Minting Content:**
    * Navigate to the "Mint Content" dashboard.
    * Select content type (Article, Music, Video, Art).
    * Fill in details: title, description, tags, price.
    * Upload media files, which are pinned to **IPFS**.
    * Configure **Bonsai Smart Media** options for interactive features.
    * The backend processes this information, prepares metadata, and facilitates the minting of the Smart Media NFT on **Lens Chain** via Bonsai SDK interactions.
    * (Future/Hackathon Goal) Optionally create a Lens publication (e.g., a Post) automatically for the newly minted NFT.

4.  **For Consumers - Discover & Engage:**
    * Explore the public marketplace to discover diverse content.
    * Filter and sort NFTs by category, price, etc.
    * View NFT details, interact with Bonsai Smart Media features.
    * Follow favorite creators (Lens Protocol `follow` primitive).
    * Collect NFTs (Lens Protocol `collect` primitive, if applicable to the NFT type).
    * Manage their owned assets, bids, and favorites in their personalized "My Marketplace" dashboard.

5.  **Social Layer with Lens Protocol:**
    * User profiles are linked to or are Lens Profiles.
    * Follow/unfollow mechanics.
    * Content can be published as Lens publications.
    * Collection of content can be tied to Lens collect actions.

---

## 💻 Tech Stack

DecentraHub is built with a modern, robust, and decentralized-first technology stack:

* **Frontend:**
    * Next.js (React Framework)
    * Tailwind CSS (Utility-first CSS)
    * ShadCN/UI (Beautifully designed, accessible UI components)
    * Framer Motion (Animations)
    * Lucide Icons (Icons)
    * Wagmi & Viem (Ethereum interaction)
    * ConnectKit (Wallet connection)
    * Sonner (Toast notifications)
* **Backend:**
    * Node.js
    * Express.js (Web framework)
    * TypeScript
    * PostgreSQL (Relational Database)
    * Sequelize (ORM for PostgreSQL)
* **Blockchain & Decentralization:**
    * **Lens Protocol:** Social graph and primitives.
    * **Lens Chain:** Target blockchain for NFT deployment.
    * **Bonsai Smart Media Protocol:** For creating interactive and dynamic NFTs.
    * **IPFS:** Decentralized storage for media assets (via Pinata for pinning).
    * **Alchemy:** RPC provider for interacting with Lens Chain.
* **Shared:**
    * TypeScript for type safety across frontend and backend.

---

## 🚀 Getting Started / How to Run

Follow these instructions to set up and run DecentraHub locally.

### Prerequisites

* Node.js (v18.19.1 or a version compatible with npm v11.1.0 like `^20.17.0 || >=22.9.0`)
* npm (v11.1.0 recommended) or yarn
* PostgreSQL server installed and running.
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/decentrahub.git
cd decentrahub || exit

echo "✅ Repository cloned and entered."

# Create .env files
echo "🔧 Creating .env files..."

# Frontend .env.local
mkdir -p frontend
cat <<EOL > frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_LENS_ENVIRONMENT=development
NEXT_PUBLIC_LENS_CHAIN_ID=137
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
EOL

# Backend .env
mkdir -p backend
cat <<EOL > backend/.env
PORT=4000
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/decentrahub_db
JWT_SECRET=your_super_secret_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret
EOL

echo "✅ .env files created."

# Install dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

echo "✅ All dependencies installed."

echo "🚀 Setup complete! Next steps:"
echo "1. Edit your .env files to include real credentials."
echo "2. Run migrations (if needed):"
echo "   npx sequelize-cli db:create && npx sequelize-cli db:migrate"
echo "3. Start the backend (cd backend && npm run dev)"
echo "4. Start the frontend (cd frontend && npm run dev)"
