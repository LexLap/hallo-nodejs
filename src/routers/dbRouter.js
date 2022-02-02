const express = require('express');
const { connection } = require('../db/mysql');
const router = new express.Router();


router.get('/highest-salary?', async (req, res) => {

    const job = req.query.job

    connection.query(
        `
        SELECT person_name, job, salary 
        FROM Persons
        WHERE job = ?
        ORDER BY salary desc
        LIMIT 1
        `,
        [job],
        function (error, result) {
            if (result) res.status(200).send(result[0])
            else res.status(500).send({
                message: "Internal server error"
            })
        }
    )
})

router.get('/avg-salaries', async (req, res) => {

    connection.query(
        `
        SELECT job, AVG(salary) AS salary FROM Persons
        GROUP BY job
        `,
        function (error, result) {
            if (result) res.status(200).send(result)
            else res.status(500).send({
                message: "Internal server error"
            })
        }
    )
})

router.get('/jobs-popularity', async (req, res) => {
    connection.query(
        `
        SELECT job, COUNT(*) AS counter FROM Persons
        GROUP BY job
        `,
        function (error, result, rows) {
            if (result) res.status(200).send(result)
            else res.status(500).send({
                message: "Internal server error"
            })
        }
    )
})

router.post('/person', async (req, res) => {

    const valuesForInsert = [[req.body.name, req.body.job, req.body.salary]]
    const valuesForUpdate = [req.body.job, req.body.salary, req.body.name]

    connection.query(
        `
        INSERT INTO Persons (person_name, job, salary) VALUES ?
        `,
        [valuesForInsert],

        function (error, result) {

            if (result) return res.status(201).send({ message: "Person created successfully" })

            if (error && error.code == 'ER_DUP_ENTRY') {
                connection.query(
                    ` 
                    UPDATE Persons
                    SET job = ?, salary = ?
                    WHERE person_name = ?
                    `,
                    valuesForUpdate,

                    function (error) {
                        if (error) res.status(500).send({ message: "Internal server error" })
                        else res.status(200).send({ message: "Person updated successfully" })
                    }
                )
            } else res.status(500).send({ message: "Internal server error" })
        }
    )

})


module.exports = router