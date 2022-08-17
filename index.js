module.exports = function ({types: t}) {
    return {
        // jsxの解析を可能にするため、下記継承する
        inherits: require('babel-plugin-syntax-jsx'),
        visitor: {
            JSXElement(path) {
                // nothing logs to the console
                // console.log("Visiting: " + path);
            },
            ReturnStatement(path) {
                console.log(createElement(path.node.argument))
                path.replaceWithSourceString(`test`)
            }
        }
    }
}

const createElement = (node) => {
    if (node.type === "JSXElement") {
        const openingName = node.openingElement.name.name
        const closingName = node.closingElement.name.name
    
        if (openingName !== closingName) {
            throw new Error("unexpected error")
        }
    
        const element = {
            type: openingName
        }
    
        if (node.children) {
            const children = node.children
                .filter(child => child.type === "JSXElement")
                .map((child) => {
                    return createElement(child)
                })
    
            Object.assign(element, {children})
        }
        return element
    }
    return node.children ? node.children
        .filter(child => child.type === "JSXElement")
        .map((child) => {
            return createElement(child)
        }) : null
}