
.PONY: all

dropdb:
	mongo jobapi --eval 'db.dropDatabase();' > /dev/null 2>&1
