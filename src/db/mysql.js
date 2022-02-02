const mysql = require('mysql2');
const dataFromJson = require('./data.json')

const dataToInsert = dataFromJson.map(obj => {
    return [obj.name, obj.job, obj.salary]
})


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'admin',
    password: 'admin',
    database: 'mysql'
});

connection.query(

    `CREATE DATABASE IF NOT EXISTS hallo015_exc`,
    function (error) {
        if (error) console.log(error);
    }
);

connection.query(

    `USE hallo015_exc`,
    function (error) {
        if (error) console.log(error);
    }
)

connection.query(

    `CREATE TABLE Persons (
        person_name varchar(255) UNIQUE KEY NOT NULL,
        job varchar(255) NOT NULL,
        salary int NOT NULL
    )`,

    function (error) {
        if (!error) {
            const sql = "INSERT INTO Persons (person_name, job, salary) VALUES ?";
            connection.query(sql, [dataToInsert], function (error) {
                if (error) console.log(error);
            });
        }
    }
);



module.exports = {
    connection
}

