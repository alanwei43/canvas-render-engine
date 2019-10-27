import { RenderChain, Logger } from "../index";
import { RenderCoordsResult } from "../../models/index";
import { FunctionContext } from "./FunctionContext";

enum FieldNameType {
    string, number, boolean, function, expression, with
}

export class ElementConverter {
    private context: FunctionContext

    constructor(context: FunctionContext) {
        this.context = context;
        Logger.debug("function context: ", this.context);
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
        Logger.debug(`根据属性名(${attrName})获取字段名称和字段值的类型`);
        const matches = /^(@|data:|expr:|func:|\$|with:)([^:]+)(:[a-z]+)?/.exec(attrName);
        if (!matches || !matches.length) {
            Logger.debug("属性名不是有效的数据绑定")
            return null;
        }
        const fieldType = matches[1], returnType = matches[3];
        const result = {
            fieldName: matches[2],
            valueType: FieldNameType.string
        };
        Logger.debug(`属性名绑定关联的字段名为: ${result.fieldName}`);
        if (fieldType === "data:" || fieldType === "@") {
            let valueType = FieldNameType.string;
            switch (returnType) {
                case ":string": valueType = FieldNameType.string; break;
                case ":number": valueType = FieldNameType.number; break;
                case ":boolean": valueType = FieldNameType.boolean; break;
            }
            result.valueType = valueType;
            return result;
        }
        if (fieldType === "expr:") {
            result.valueType = FieldNameType.expression;
            return result;
        }
        if (fieldType === "func") {
            result.valueType = FieldNameType.function;
            return result;
        }
        if (fieldType === "$" || fieldType === "with:") {
            result.valueType = FieldNameType.with;
            return result;
        }
        return null;
    }
    private convertFieldNameHyphen(name: string): string {
        const parts = name.split("-");
        const fieldName = parts.splice(1, parts.length - 1).reduce((prev, next) => {
            prev += next[0].toUpperCase() + next.substr(1);
            return prev;
        }, parts[0]);
        if (fieldName !== name) {
            Logger.debug(`key为: ${name}, 转换后的key为${fieldName}`);
        }
        return fieldName;
    }
    private calculateFieldValue(valueLiteral: string, valueType: FieldNameType): any {
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
        if (valueType === FieldNameType.with) {
            return this.calculateFieldValue(`with(this) { return  ${valueLiteral}; }`, FieldNameType.function);
        }
        return null;
    }
    private updateObjValue(data: any, key: string, value: any): void {
        Logger.debug(`准备更新对象 ${key} 字段的值为: `, value);
        const parts = key.split(".").map(key => this.convertFieldNameHyphen(key));
        Logger.debug(`对象的key为: ${parts.join(".")}`);
        const latestPartObj = parts.splice(0, parts.length - 1).reduce((prev, next) => {
            if (prev[next] === null || prev[next] === undefined) {
                prev[next] = {};
            }
            return prev[next];
        }, data);
        latestPartObj[parts[0]] = value;
        Logger.debug(`完成对象key为${parts.join(".")}的值更新: `, data);
    }
    generateAttributes<TData>(element: HTMLElement, data: TData): TData {
        Logger.debug("迭代元素(", element, ")所有属性, 返回数据");
        element.getAttributeNames().forEach(attrName => {
            Logger.debug("元素属性名: ", attrName);
            const fieldNameAndType = this.getFieldNameAndType(attrName);
            if (fieldNameAndType == null) {
                Logger.warn(`元素属性名${attrName}不是有效的数据绑定格式`);
                return;
            }
            const attrValue: string = element.getAttribute(attrName);
            const fieldValue = this.calculateFieldValue(attrValue, fieldNameAndType.valueType);
            this.updateObjValue(data, fieldNameAndType.fieldName, fieldValue);

            Logger.debug(`元素属性名为: ${attrName}, 属性值为: ${attrValue}, 对应的字段名为: ${fieldNameAndType.fieldName}, 字段值的类型为: ${fieldNameAndType.valueType}, 字段值为: `, fieldValue);
        });
        Logger.debug("元素(", element, ")属性迭代完成, 返回结果: ", data);
        return data;
    }
}