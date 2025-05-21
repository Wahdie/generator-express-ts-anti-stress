import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IUser {
      
        id?: number;
      
        name: string;
      
        email: string;
      
        password: string;
      
        role?: string;
      
        isActive?: boolean;
      
}      


class User extends Model<IUser> implements IUser {

  declare id?: number;

  declare name: string;

  declare email: string;

  declare password: string;

  declare role?: string;

  declare isActive?: boolean;

}

User.init(
  {

  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },


  name: {
    type: DataTypes.STRING, allowNull: false,
  },


  email: {
    type: DataTypes.STRING, allowNull: false,unique: true,
  },


  password: {
    type: DataTypes.STRING, allowNull: false,
  },


  role: {
    type: DataTypes.STRING, 
  },


  isActive: {
    type: DataTypes.BOOLEAN, 
  },


  },
  {
    sequelize,
    modelName: 'user',
    timestamps: true,
    
    tableName: 'users',
    
    freezeTableName: true
  }
);

export default User;