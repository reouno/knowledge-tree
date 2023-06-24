import Emoji, { EmojiConvertor } from 'emoji-js'

export const convertEmoji = (
  s: string,
  converter: Emoji | undefined = undefined
): string => {
  const emo = converter || new EmojiConvertor()
  emo.replace_mode = 'unified'
  return emo.replace_colons(s)
}

export const formatToHtml = (s: string): string => {
  return s
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n{3,}/g, '\n\n') // trim successive \n in 2 times
    .replace(/\n/g, '<br />')
    .replace(
      /(https?:\/\/[-_.!~*'()a-zA-Z0-9/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    ) // convert URL to a tag link
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // markdown strong
    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // markdown italic
}
