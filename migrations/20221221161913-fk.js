'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts","writer_id",{
      allowNull: false,
      type: Sequelize.INTEGER
    });
    await queryInterface.addConstraint("Posts", {
      fields : ["writer_id"],
      type : "foreign key",
      name : "User_Post_fk_id",
      references : {
        table : "Users",
        field : "id"
      },
      onDelete : "cascade",
      onDelete : "cascade"
    });
    await queryInterface.addColumn("Comments","writer_id",{
      allowNull: false,
      type: Sequelize.INTEGER
    });
    await queryInterface.addConstraint("Comments", {
      fields : ["writer_id"],
      type : "foreign key",
      name : "User_Comment_fk_id",
      references : {
        table : "Users",
        field : "id"
      },
      onDelete : "cascade",
      onDelete : "cascade"
    });
    await queryInterface.addColumn("Comments","post_id",{
      allowNull: false,
      type: Sequelize.INTEGER
    });
    await queryInterface.addConstraint("Comments", {
      fields : ["post_id"],
      type : "foreign key",
      name : "Post_Comment_fk_id",
      references : {
        table : "Posts",
        field : "id"
      },
      onDelete : "cascade",
      onDelete : "cascade"
    });
    await queryInterface.addColumn("Likes","post_id",{
      allowNull: false,
      type: Sequelize.INTEGER
    });
    await queryInterface.addConstraint("Likes", {
      fields : ["post_id"],
      type : "foreign key",
      name : "Post_Like_fk_id",
      references : {
        table : "Posts",
        field : "id"
      },
      onDelete : "cascade",
      onDelete : "cascade"
    });
    await queryInterface.addColumn("Likes","user_id",{
      allowNull: false,
      type: Sequelize.INTEGER
    });
    await queryInterface.addConstraint("Likes", {
      fields : ["user_id"],
      type : "foreign key",
      name : "User_Like_fk_id",
      references : {
        table : "Users",
        field : "id"
      },
      onDelete : "cascade",
      onDelete : "cascade"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
