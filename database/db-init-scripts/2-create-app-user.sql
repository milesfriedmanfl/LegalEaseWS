USE wiki_search;

CREATE USER IF NOT EXISTS '${MYSQL_APP_USER}'@'%' IDENTIFIED BY '${MYSQL_APP_PASSWORD}';
GRANT SELECT, INSERT, UPDATE, DELETE ON wiki_search.* TO '${MYSQL_APP_USER}'@'%';
FLUSH PRIVILEGES;