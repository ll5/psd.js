const _ = require('lodash');

const RESOURCES = [require('./resources/layer_comps')];

class ResourceSection {
    constructor() {
    }

    factory(resource) {
        for(let i = 0; i < RESOURCES.length; i++) {
            let Section = RESOURCES[i];
            if(Section.prototype.id !== resource.id) {
                continue;
            }
            return _.tap(new Section(resource), function(s) {
                return s.parse();
            });
        }
        return null;
    };
};

module.exports = ResourceSection;
