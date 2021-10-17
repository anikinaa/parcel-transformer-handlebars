import * as Handlebars from 'handlebars'
import { Transformer } from '@parcel/plugin';

export default new Transformer({
    async transform({asset}) {
        const source = await asset.getCode();
        const precompiled = Handlebars.precompile(source);
        const js = `
                import Handlebars from 'handlebars/dist/handlebars.runtime';
                const templateFunction = Handlebars.template(${precompiled});
                export default templateFunction;
                `;
        asset.setCode(js);
        return [asset];
    }
});
