import ReflectionModel from '../models/Reflection';

const Reflection = {
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  create(req, res) {
    if (!req.body.success && !req.body.lowPoint && !req.body.takeAway) {
      return res.status(400).send({ message: 'All fields are required' });
    }
    const reflection = ReflectionModel.create(req.body);
    return res.status(201).send(reflection);
  },
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {array} reflections array
   */
  getAll(req, res) {
    const reflections = ReflectionModel.findAll();
    return res.status(200).send(reflections);
  },
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection
   */
  getOne(req, res) {
    const reflection = ReflectionModel.findOne(req.params.id);
    if (!reflection) {
      return res.status(404).send({ message: 'Reflection not found' });
    }
    return res.status(200).send(reflection);
  },
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} updated reflection
   */
  update(req, res) {
    const reflection = ReflectionModel.findOne(req.params.id);
    if (!reflection) {
      return res.status(404).send({ message: 'Reflection not found' });
    }
    const updatedReflection = ReflectionModel.update(req.params.id, req.body);
    return res.status(200).send(updatedReflection);
  },
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} the removed reflection object
   */
  delete(req, res) {
    const reflection = ReflectionModel.findOne(req.params.id);
    if (!reflection) {
      return res.status(404).send({ message: 'Reflection not found' });
    }
    const ref = ReflectionModel.delete(req.params.id);
    return res.status(204).send(ref);
  }
};

export default Reflection;
