import { RenderChain, Logger } from "../index";
import { RenderCoordsResult } from "../../models/index";
import { FunctionContext } from "./FunctionContext";

enum FieldNameType {
    string, number, boolean, function, expression, with
}

export class ElementConverter {
    private chain: RenderChain<RenderCoordsResult>
    private context: FunctionContext

    constructor() {
        this.context = new FunctionContext();
    }

    private getFieldNameAndType(attrName: string): { fieldName: string, valueType: FieldNameType } {
        /**
         * @field-name:type  
         * data:attr-name:type
         *  @font-size:number="12"
         *  @fill-type:string="stroke"
         * 
         * [] => expression
         * expr:field-name => expression
         * 
         * () => function
         * func:field-name => function
         * 
         * $ => with
         * with:field-name => with
         */
        const matches = /^(@|data|expr|func|with):([^:]+)(:[a-z]+)?/.exec(attrName);
        if (!matches || !matches.length) {
            return null;
        }
        const fieldType = matches[1], returnType = matches[3];
        const result = {
            fieldName: matches[2],
            valueType: FieldNameType.string
        };

        if (fieldType === "data" || fieldType === "@") {
            let valueType = FieldNameType.string;
            switch (returnType) {
                case "string": valueType = FieldNameType.string; break;
                case "number": valueType = FieldNameType.number; break;
                case "boolean": valueType = FieldNameType.boolean; break;
            }
            result.valueType = valueType;
            return result;
        }
        if (fieldType === "expr") {
            result.valueType = FieldNameType.expression;
            return result;
        }
        if (fieldType === "function") {
            result.valueType = FieldNameType.function;
            return result;
        }
        return null;
    }
    private fieldNameSlashConvert(name: string): string {
        const parts = name.split("-");
        return parts.splice(1, parts.length - 1).reduce((prev, next) => {
            prev += next[0].toUpperCase() + next.substr(1);
            return prev;
        }, parts[0]);
    }
    private calculateFieldValue(valueLiteral: string, valueType: FieldNameType): any {
        Logger.debug(`calculate field value: ${valueLiteral} to type ${valueType}`)
        if (valueType === FieldNameType.boolean) {
            return valueLiteral === "false" || valueLiteral === "0" ? false : true;
        }
        if (valueType === FieldNameType.number) {
            return parseFloat(valueLiteral);
        }
        if (valueType === FieldNameType.string) {
            return valueLiteral;
        }
        if (valueType === FieldNameType.function) {
            const fn = new Function(valueLiteral);
            return fn.apply(this.context);
        }
        if (valueType === FieldNameType.expression) {
            return this.calculateFieldValue(`return (${valueLiteral});`, FieldNameType.function);
        }
        Logger.warn(`invalid field type: ${valueType}, for value: ${valueLiteral}`);
        return null;
    }
    private updateObjValue(data: any, key: string, value: any): void {
        Logger.debug(`ready update obj[${key}] = ${value}`);
        const parts = key.split(".").map(key => this.fieldNameSlashConvert(key));
        Logger.debug(`property parts: ${parts.join(" -> ")} `);
        const latestPartObj = parts.splice(0, parts.length - 1).reduce((prev, next) => {

            Logger.debug(`update obj key of ${next}`);
            if (prev[next] === null || prev[next] === undefined) {
                prev[next] = {};
            }
            return prev[next];
        }, data);
        latestPartObj[parts[0]] = value;
        Logger.debug(`complete update obj[${key}] = ${value}`);
    }
    generateAttributes<TData>(element: HTMLElement, data: TData): TData {
        element.getAttributeNames().forEach(attrName => {
            const fieldNameAndType = this.getFieldNameAndType(attrName);
            if (fieldNameAndType == null) {
                Logger.warn("invalid attr name: " + attrName);
                return;
            }
            Logger.debug(`valid attr name is ${fieldNameAndType.fieldName}, type is ${fieldNameAndType.valueType}`);

            const attrValue: string = element.getAttribute(attrName);
            const fieldValue = this.calculateFieldValue(attrValue, fieldNameAndType.valueType);
            Logger.debug(`the value of ${fieldNameAndType.fieldName} is ${fieldValue}`);
            this.updateObjValue(data, fieldNameAndType.fieldName, fieldValue);
        });
        return data;
    }
}