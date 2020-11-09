'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Literature',
      [
        {
          title:
            'Role Playing Game (RPG) "Legenda Ular Kepala Tujuh" Dengan Editor RPG Maker VX',
          userId: 1,
          publication_date: 'March 2013',
          year: '2013',
          pages: 8,
          isbn: 1391273190971,
          author: 'Funny Farady C',
          attache:
            'https://res.cloudinary.com/abdi-faishal/raw/upload/v1604755808/literature/attaches/1604755800937-rpg-legenda-ular-kepala-tujuh.pdf',
          image:
            'https://res.cloudinary.com/abdi-faishal/image/upload/v1604755810/literature/images/1604755804393-rpg-kepala-tujuh.jpg',
          status: 'waiting',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Literature', null, {});
  },
};
