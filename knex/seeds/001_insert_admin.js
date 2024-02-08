
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('usuarios').del()
    .then(function () {
      // Inserts seed entries
      return knex('usuarios').insert([
        {
          grupo_id: 1,
          email: 'admin@digitalazul.com.br',
          senha: '$2b$10$hz6ku5UZZcNMhhc49tpF8eceICyPkUVQ45iMK3v4NbI1u/ZomukVi',
          hash: '$2b$05$s2dWB/dHi8ULxWyokEMn0uRRufCz9M2oJnOSCOuyHfEeuHEEFKmQm',
        },
        {
          grupo_id: 1,
          email: 'admin@somar.local',
          senha: '$2b$10$2KqerQ1VEClQiPqNqMG6peBUiH/YJQoAH8LD2G04kPJh2hLGjnGY2',
          hash: '$2b$05$kToTyW1HfzpGPY2ro.3V4.L0vASnez5zOpnXrsZCgu9WvhLk1UdCi',
        },
      ]);
    });
};
