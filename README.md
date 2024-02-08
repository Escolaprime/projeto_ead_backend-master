# Projeto Aprendizagem `EAD`
<p>&nbsp;</p>

> Código de backend
<p>&nbsp;</p>

## Faixa de Portas IP
```
48620–49150
WWW:48680
SRV: 49133
```


<p>&nbsp;</p>
<p>&nbsp;</p>

# Script de implementação

## Instalação dos modúlos
<p>&nbsp;</p>

- Instalar o pacote ```NVM (Node Version Manager)```


```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

ou

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```
<p>&nbsp;</p>

- Atualizar as váriaveis de ambiente
```sh 
source ~/.bashrc
```
- Instalar a versão `LTS` do `Node js`
```sh
nvm install --lts
```


- Atualizar o npm para versão mais recente e o yarn globalmente
```sh
npm i -g npm@latest yarn pm2
```
<p>&nbsp;</p>

## Instalação do banco de dados Postgresql

- Instalar os pacotes do postgres

```sh
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo apt-get update

sudo apt-get -y install postgresql
```
<p>&nbsp;</p>

- Alterar a senha do usuário postgres
```sh
sudo su postgres # ou su postgres

psql

ALTER USER postgres WITH PASSWORD 'senha';
# Aparecerá ALTER ROLE
```
