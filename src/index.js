/*
function awaitAttribute () {

}
function callback (mutations) {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes') {
      const attributes = mutation.target.attributes
      if (attributes.role?.value === 'document') {
        if (attributes['aria-label']?.value.endsWith('.md')) {
          console.log('showing document!', mutation)
        }
      }
      // output.textContent = `The ${mutation.attributeName} attribute was modified from "${mutation.oldValue}".`
    }
  }
}

const observer = new MutationObserver(callback)

const target = document.querySelector('[role="dialog"]') || document.body

observer.observe(target, {
  attributeFilter: ['role', 'aria-label'],
  subtree: true,
})
observer.disconnect()
*/

function awaitElement (target, selector, once = false) {
  return new Promise(function (resolve, reject) {
    // attempt to match immediately
    if (once === true) {
      const match = target.querySelector(selector)
      // FIXME why can't I return early? it doesn't seem to set us up for next time maybe?
      if (match) {
        // return resolve(match)
      }
    }

    // extract attribute as attribute filter seems buggy
    let attribute = ''
    const matches = selector.match(/\[(\w+)=".+?"/)
    if (matches) {
      attribute = matches[1]
    }

    // otherwise, wait for creation
    const observer = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        // mutation.target.attributes[attribute] &&
        if (mutation.target?.matches(selector)) {
          if (once) {
            observer.disconnect()
          }
          return resolve(mutation.target, mutation)
        }
      }
    })

    // start observing
    observer.observe(target, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeOldValue: true,
      // attributeFilter: ['aria-role', 'ariaRole', 'role'],
    })
  })
}

function render (target) {
  console.log('render:', target)
  if (target.attributes['aria-label']?.value.endsWith('.md')) {
    const markdown = target.querySelector('pre').innerText
    const [, head, body] = markdown.match(/(?:---([\s\S]+)---)([\s\S]+)/)
    const frontmatter = head ? `<pre>${head}</pre>` : ''
    const html = window.marked.parse(body)
    target.innerHTML = `<div id="output" class="content markdown-body">${frontmatter + html}</div>`
  }
}

// currently, I think we're adding more and more observers. Need to check that we're not!

const body = document.body

function watch (target) {
  console.log('watch:', target)
  awaitElement(target, '[role="document"]', true)
    .then((target) => {
      console.log('found:', target)
      render(target)
      watch(body)
    })
}

void awaitElement(body, '[role="dialog"]', true).then(watch)

