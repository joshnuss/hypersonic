import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

export function convertMarkdown(markdown) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .use(addPositions)
    .processSync(markdown)

  return String(file)
}

function addPositions() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.tagName == 'li') {
        node.properties.dataOffset = node.position.start.offset
      }
    })
  }
}
