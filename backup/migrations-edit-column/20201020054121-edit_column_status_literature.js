'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Literature', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'waiting',
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Literature', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'waiting approve',
    });
  },
};
