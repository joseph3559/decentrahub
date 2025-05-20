// src/models/User.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/config/db.config'; // Import the Sequelize instance

// Define allowed roles
export type UserRoleType = 'creator' | 'consumer';

// Interface for User attributes (fields in the table)
interface UserAttributes {
  id: number; // Primary key, auto-incrementing integer
  walletAddress: string;
  role?: UserRoleType;
  lensProfileId?: string | null;
  lensHandle?: string | null;
  fullName?: string | null;
  bio?: string | null;
  email?: string | null; // For notifications
  avatarUrl?: string | null;
  website?: string | null;
  twitterHandle?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for User creation attributes (some fields are optional at creation)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'lensProfileId' | 'lensHandle' | 'fullName' | 'bio' | 'email' | 'avatarUrl' | 'website' | 'twitterHandle'> {}

// Define the Sequelize Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public walletAddress!: string;
  public role?: UserRoleType;
  public lensProfileId?: string | null;
  public lensHandle?: string | null;
  public fullName?: string | null;
  public bio?: string | null;
  public email?: string | null;
  public avatarUrl?: string | null;
  public website?: string | null;
  public twitterHandle?: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    walletAddress: {
      type: new DataTypes.STRING(100), // Ethereum address length
      allowNull: false,
      unique: true, // Ensure wallet addresses are unique
      validate: {
        isLowercase: true, // Optional: enforce lowercase
      },
    },
    role: {
      type: DataTypes.ENUM('creator', 'consumer'),
      allowNull: true, // Or false if role must be set immediately
    },
    lensProfileId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // If you want to ensure only one user per Lens profile ID
    },
    lensHandle: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // If you want to ensure only one user per Lens handle
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT, // TEXT for potentially longer bios
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // If email should be unique
      validate: {
        isEmail: true, // Basic email validation
      },
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true, // Basic URL validation
      },
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    twitterHandle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // We need to pass the connection instance
    tableName: 'users', // Explicitly define table name
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    underscored: true, // Optional: use snake_case for column names in DB (e.g., wallet_address)
                       // If true, ensure your attributes in JS match this convention or map them.
                       // For simplicity, keeping camelCase for JS attributes and letting Sequelize handle DB names.
  }
);

export default User;
