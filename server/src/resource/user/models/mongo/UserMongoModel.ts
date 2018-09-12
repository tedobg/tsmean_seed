import { BaseMongoModel } from './../../../../core/models/resource/base/BaseMongoModel';
import { BaseMongoModelConfig, BaseMongoRelation } from './../../../../core/models/resource/base/BaseMongoTypes';
import { IUserMongoModel } from './IUserMongoModel';

import * as md5 from 'md5';
import config from '../../../../configuration/general';
import { IGroupMongoModel } from '../../../group';

export class UserMongoModel extends BaseMongoModel<IUserMongoModel> {
    name = 'users';
    lookupField: 'username' = 'username';
    projections = {
        default: {
            _id: false,
            username: true,
            group: true,
        },
        extended: {
            _id: false,
            username: true,
            group: true,
            country: true,
            age: true,
            allowedServices: true,
            allowedRoutes: true
        },
        extendedWId: {
            _id: true,
            username: true,
            password: true,
            group: true,
            country: true,
            age: true,
            allowedServices: true,
            allowedRoutes: true
        }
    }
    resultsPerPage = 5;
    filters = ['country', 'age'];
    enableSoftDelete = false;
    relations = {
        group: new BaseMongoRelation<IGroupMongoModel>({
            from: 'groups',
            projections: {
                default: { name: true },
                extended: { 
                    _id: false,
                    name: true,
                    allowedRoutes: true,
                    allowedServices: true
                }
            },
        })
    };
    schemaValidation =  {
        $jsonSchema: {
            bsonType: "object",
            required: ['username'],
            properties: {
                username: {
                    bsonType: "string"
                },
                password: {
                    bsonType: "string"
                },
                age: {
                    bsonType: "int"
                },
                country: {
                    bsonType: "string",
                    minLength: 2,
                    maxLength: 2
                },
                group: {
                    bsonType: "objectId"
                },
                allowedServices: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        properties: {
                            method: {
                                bsonType: "string",
                            },
                            path: {
                                bsonType: "string"
                            }
                        }
                    }
                },
                allowedRoutes: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    }
                }
            }
        }
    }

    schemaIndexes = [{
        keys: {
            username: 1,
        },
        options: {
            unique: true
        }
    }];

    onPreSave(entity: IUserMongoModel) {
        if(!entity.password)
            return true;
            
        entity.password = md5(entity.password + config.pswdSalt);
        return true;
    }
}

export let userMongoModel = new UserMongoModel();
export let User = userMongoModel.get();