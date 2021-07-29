require 'liquid'
require 'uri'

# Capitalize all words of the input
module Jekyll
  module Camelize
    def camelize(s)
      words = s.split(' ')
      for i in 0..words.length()
        word = words[i]
        if word.class == String
          word[0] = word[0].capitalize()
        end
        words[i] = word
      end
      return words.join(' ')
    end
  end
end

Liquid::Template.register_filter(Jekyll::Camelize)