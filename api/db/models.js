const { DataTypes, Model } = require('sequelize');

// Model for monolithic table in database
class CuesMonolithic extends Model {}

const CuesMonolithicModel = {
    projectName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'project_name'
    },
    projectIdentifier: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'project_identifier'
    },
    projectCatalogue: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'project_catalogue'
    },
    projectSegment: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'project_segment'
    },
    characterName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'character_name'
    },
    preparedCue: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'prepared_cue'
    },
    ageRange: {
        type: DataTypes.ARRAY(DataTypes.BIGINT),
        allowNull: false,
        defaultValue: [0,0],
        field: 'age_range'
    },
    timelineValues: {
        type: DataTypes.ARRAY(DataTypes.DOUBLE),
        allowNull: false,
        defaultValue: [0.0,0.0],
        field: 'timeline_values'
    },
    frameRate: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        field: 'frame_rate'
    }
};

// Column names for CuesMonolithic
const qry_attributes_all = [
    CuesMonolithicModel.projectName.field,
    CuesMonolithicModel.projectIdentifier.field,
    CuesMonolithicModel.projectCatalogue.field,
    CuesMonolithicModel.projectSegment.field,
    CuesMonolithicModel.characterName.field,
    CuesMonolithicModel.preparedCue.field,
    CuesMonolithicModel.ageRange.field,
    CuesMonolithicModel.timelineValues.field,
    CuesMonolithicModel.frameRate.field
];

module.exports = {
    CuesMonolithic,
    CuesMonolithicModel,
    qry_attributes_all
}