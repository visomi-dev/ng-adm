# DB

## Installation

### Move to superuser

```bash
sudo su -l
```

### Configure Repositories (Debian 11)

```bash
# Create the file repository configuration:
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key:
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update the package lists:
sudo apt-get update
```

### Install Dependencies (Ubuntu 22.04 / Debian 11)

```bash
apt install build-essential libpq-dev postgresql postgresql-contrib
```

### Enable PostgreSQL

```bash
sudo -u postgres
```

```bash
systemctl enable postgresql --now
```

```bash
CREATE DATABASE elmanadeldia;
CREATE USER elmanadeldia WITH ENCRYPTED PASSWORD 'elmanadeldia';
GRANT ALL PRIVILEGES ON DATABASE elmanadeldia TO elmanadeldia WITH GRANT OPTION;
ALTER USER elmanadeldia WITH SUPERUSER;
```
