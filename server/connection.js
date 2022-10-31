const {Sequelize, DataTypes} = require("sequelize");
console.log("Database host",process.env.DB_HOST_IP);
const sequelize = new Sequelize(
    'crawling',
    'postgres',
    'postgres',
     {
       host: process.env.DB_HOST_IP,
       dialect: 'postgres',
       sync: { force: true },
       pool: {
            max: 10,
            idle: 60000,
            acquire: 120000,
        }
     }
);
const Job = sequelize.define("job_information", {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    job_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    job_name: {
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue:''
    },
    job_url: {
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue:''
    },
    status: {
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue: 'in_progress',
        comment: "in_progress->In Progress, completed->Completed, enqueued->Enqueued, 3->Deleted, failed->Failed"
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
 },{
    sequelize,
    tableName: 'job_information',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
});

const Crawling = sequelize.define("crawling_information", {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    url:{
        type: DataTypes.STRING(700),
        allowNull: false,
        defaultValue: ''
    },
    title: {
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue:''
    },
    brand: {
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue:''
    },
    image_path:{
        type: DataTypes.STRING(700),
        allowNull: false,
        defaultValue: ''
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
 },{
    sequelize,
    tableName: 'crawling_information',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
});
 

 module.exports = {
    Job,
    Crawling,
    sequelize
 };