var SQLite = require('react-native-sqlite-storage')
let conn = SQLite.openDatabase("test.db", "1.0", "Test Database", 200000, this.openCB, this.errorCB);

class SqliteCalls  {
    getConnection() {
        return conn;
    }
}

module.exports = new SqliteCalls();