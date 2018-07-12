/**
 * Created by mosluce on 2015/11/6.
 */
module.exports = function (Schema) {
    return {
        table: 'Hello',
        schema: {
            fielda: String,
            fieldb: Number,
            fieldc: {
                type: Schema.Types.ObjectId
            }
        }
    };
};