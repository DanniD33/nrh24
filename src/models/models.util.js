const all = (model) => {
    return model.find();
};

const children = (model, parent) => {
    return model.find(parent);
};

const one = (model, req) => {
    const { id } = req.params;
    return model.findById(id);
};

const create = (entity) => {
    return entity.save();
};

const update = (model, req) => {
    const { id } = req.params;
    return model.updateOne({ _id: id }, req.body);
};

const deleteEntity = (model, req) => {
    const { id } = req.params;
    return model.findByIdAndDelete(id);
};

module.exports = {
    all,
    children,
    one,
    create,
    update,
    deleteEntity
}