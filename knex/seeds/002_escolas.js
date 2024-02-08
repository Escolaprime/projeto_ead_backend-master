
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('escolas').del()
    .then(function () {
      // Inserts seed entries
      return knex('escolas').insert([
        {
          id: 1, 
          nome_escola: 'Escola Garanhuns'
        }
      ]);
    });
};
