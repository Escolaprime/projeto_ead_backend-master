
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('etapas').del()
    .then(function () {
      // Inserts seed entries
      return knex('etapas').insert([
        {
          escola_id: 1,
          titulo: '4º ANO',
          descricao: ''
        },
        {
          escola_id: 1,
          titulo: '5º ANO',
          descricao: ''
        },
        {
          escola_id: 1,
          titulo: '8º ANO',
          descricao: ''
        },
        {
          escola_id: 1,
          titulo: '9º ANO',
          descricao: ''
        },
        {
          escola_id: 1,
          titulo: 'AJUDA',
          descricao: ''
        }
      ]);
    });
};
