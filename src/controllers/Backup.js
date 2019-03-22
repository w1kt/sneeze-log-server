import uuidv4 from 'uuid/v4';
import moment from 'moment';
import db from '../db';

const Backup = {
  async push(req, res) {
    if (!req.body.store) {
      return res.status(400).send({ message: 'No store found in payload' });
    }

    const query = `
    INSERT INTO
    backup(id, owner_id, store, created_date, modified_date)
    VALUES($1,$2,$3,$4,$5)
    ON CONFLICT (owner_id) DO UPDATE
      SET store = EXCLUDED.store,
          modified_date = EXCLUDED.modified_date;
    `;
    const values = [
      uuidv4(),
      req.user.id,
      req.body.store,
      moment(new Date()),
      moment(new Date())
    ];
    try {
      const { rows } = await db.query(query, values);
      res
        .status(201)
        .send({ message: 'Store successfully backed up', store: rows[0] });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  async pull(req, res) {
    const query = `SELECT store FROM backup WHERE owner_id = '${req.user.id}'`;
    console.log(query);
    try {
      const { rows } = await db.query(query);
      if (!rows[0]) {
        return res.status(404).send({'message': 'No backup found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      res.status(400).send(error);
    }
  }
};

export default Backup;
