const { default: svgr } = require('@svgr/core')
const fs = require('fs')


const dir = './svgr_raw/'


async function main() {

const output = ['import * as React from "react";']
const names = []

try {
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    const res = await fs.promises.readFile(dir+file, 'utf-8')
    let name = file.split('.')[0]
    name = name[0].toUpperCase() + name.slice(1)
    names.push(name)
    const jsx = await svgr(res, { icon: true, plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'] }, { componentName: name })
    const split = jsx.split('\n')
    output.push(split.slice(1,split.length-2).join('\n'))
  }

  output.push(`export { ${names.join(', ')} };`)


  const data = fs.writeFileSync('../src/icons.jsx', output.join(''))


} catch (err) {
  console.error(err);
}

}




main()
