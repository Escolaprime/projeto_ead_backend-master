
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('grupos').del()
    .then(function () {
      // Inserts seed entries
      return knex('grupos').insert([
        {
          nome_grupo: 'ADMIN INTERNO',
          descricao: 'ADMIN INTERNO'
        },
        { 
          nome_grupo: 'ADMIN SECRETARIA',
          descricao: 'ADMIN SECRETARIA'
        },
        {
          nome_grupo: 'COORDENAÇÃO INTERNA',
          descricao: 'COORDENAÇÃO INTERNA'
        },
        {
          nome_grupo: 'COORDENAÇÃO SECRETARIA',
          descricao: 'COORDENAÇÃO SECRETARIA'
        }, 
        {
          nome_grupo: 'VIZUALIZAÇÃO INTERNA',
          descricao: 'VIZUALIZAÇÃO INTERNA'
        },
        {
          nome_grupo: 'VIZUALIZAÇÃO SECRETARIA',
          descricao: 'VIZUALIZAÇÃO SECRETARIA'
        },
      ]);
    });
};
