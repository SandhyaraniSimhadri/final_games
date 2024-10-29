export default class SimpleEquationCalculator {
    static isRight(members) {
        if (members.length < 5 || members.length % 2 === 0)
            throw new Error("Invalid members length");
        return SimpleEquationCalculator.calculate(...members.slice(0, -2)) === Number(members.last());
    }
    static calculate(...members) {
        const nodesAndOperators = SimpleEquationCalculator.toNodesAndOperators(members);
        return SimpleEquationCalculator.reduce(nodesAndOperators.nodes, nodesAndOperators.operators).result;
    }
    static toNodesAndOperators(members) {
        return {
            nodes: members.skipAllWhile((_, i) => i % 2 === 1).map(x => new ValueNode(Number(x))),
            operators: members.skipAllWhile((_, i) => i % 2 === 0)
        };
    }
    static reduce(nodes, operators) {
        nodes = [...nodes];
        operators = [...operators];
        while (operators.length > 0) {
            const index = SimpleEquationCalculator.getHighestPriorityOperatorIndex(operators);
            const operator = operators[index];
            operators.splice(index, 1);
            const equationNode = new EquationNode();
            equationNode.left = nodes[index];
            equationNode.right = nodes[index + 1];
            equationNode.operator = operator;
            nodes.splice(index, 2, equationNode);
            operators.splice(index, 1);
        }
        return nodes[0];
    }
    static getInverseOperator(operator) {
        switch (operator) {
            case "+":
                return "-";
            case "-":
                return "+";
            case "*":
                return "/";
            case "/":
                return "*";
            default:
                throw new Error("Invalid operator");
        }
    }
    static getHighestPriorityOperatorIndex(operators) {
        const orderOfOperators = ["/", "*", "x", "+", "-"];
        for (let orderOfOperator of orderOfOperators) {
            for (let i = 0; i < operators.length; i++) {
                if (orderOfOperator.includes(operators[i])) {
                    return i;
                }
            }
        }
        return -1;
    }
    static calculateEmptyForNormal(...members) {
        const index = members.indexOf("");
        if (index === members.length - 1)
            return SimpleEquationCalculator.calculate(...members.slice(0, -2));
        if (index === 0)
            return SimpleEquationCalculator.calculate(members.last(), SimpleEquationCalculator.getInverseOperator(members[1]), members[2]);
        switch (members[1]) {
            case "+":
                return SimpleEquationCalculator.calculate(members.last(), "-", members.first());
            case "-":
                return SimpleEquationCalculator.calculate(members.first(), "-", members.last());
            case "*":
                return SimpleEquationCalculator.calculate(members.last(), "/", members.first());
            case "x":
                return SimpleEquationCalculator.calculate(members.last(), "/", members.first());
            case "/":
                return SimpleEquationCalculator.calculate(members.first(), "/", members.last());
            default:
                throw new Error("Invalid operator");
        }
    }
}
class ValueNode {
    value;
    constructor(value) {
        this.value = value;
    }
    get result() {
        return this.value;
    }
}
class EquationNode {
    left = null;
    right = null;
    operator = "";
    get result() {
        return EquationNode.calculate(this.left.result, this.right.result, this.operator);
    }
    static calculate(first, second, operator) {
        if (operator === "/" && second === 0)
            throw new Error("Divide by zero");
        switch (operator) {
            case "+":
                return first + second;
            case "-":
                return first - second;
            case "*":
                return first * second;
            case "x":
                return first * second;
            case "/":
                return first / second;
            default:
                throw new Error("Invalid operator");
        }
    }
}
