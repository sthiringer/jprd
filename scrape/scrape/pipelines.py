# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

from scrapy.exceptions import DropItem
from scrapy.selector import Selector

class QuestionCleanerPipeline(object):
    def parse_round(self, pos):
        rounds = ["Jeopardy!", "Double Jeopardy!", "Final Jeopardy!"]
        return rounds[pos // 30]

    def parse_dd(self, question):
        return bool(question.css('td.clue_value_daily_double::text'))

    def parse_clueorder(self, question, round):
        clue_order = question.css('td.clue_order_number *::text').get()
        if round == "Final Jeopardy!":
            return 1
        elif not clue_order:
            raise DropItem("Invalid question clueorder, %s", clue_order)
        return clue_order

    def parse_text(self, question):
        text = " ".join([str(i.get()) for i in question.css('td.clue_text::text')])
        if text == "=":
           raise DropItem("Invalid question text")
        elif bool(question.css('td.clue_text a')):
            raise DropItem("Question text contains hyperlink")
        return text
    
    def parse_value(self, question, dd):
        value = question.css('td.clue_value_daily_double::text').get().split(' ')[1] if dd else question.css('td.clue_value::text').get()
        if not value:
            raise DropItem("Invalid question money value")
        return value.replace("$", "").replace(",", "")

    def parse_answer(self, question):
        #Conversions required to handle some CSS effects
        answer = Selector(text=question.css('table > tr > td > div').attrib['onmouseover']).css('em *::text').getall()
        if not answer:
            raise DropItem("Invalid question answer")
        return "".join(answer).strip()

    def process_item(self, item, spider):
        # Parse specific fields from question response HTML and clean them, if needed
        item['round'] = self.parse_round(item['pos'])
        item['isdailydouble'] = self.parse_dd(item['question'])
        item['clue_order'] = self.parse_clueorder(item['question'], item['round'])
        item['text'] = self.parse_text(item['question'])
        item['value'] = self.parse_value(item['question'], item['isdailydouble'])
        item['answer'] = self.parse_answer(item['question'])
        del item['question']
        del item['pos']
        return item

class DynamoTypeDefPipeline(object):  
    def process_item(self, item, spider):
        item['category'] = {"S":item['category']}
        item['airdate'] = {"S":item['airdate']}
        item['season'] = {"S":item['season']}
        item['value'] = {"N":int(item['value'])}
        item['isdailydouble'] = {"BOOL":bool(item['isdailydouble'])}
        item['text'] = {"S":item['text']}
        item['answer'] = {"S":item['answer']}
        item['clue_order'] = {"N":int(item['clue_order'])}
        item['round'] = {"S":item['round']}
        item['gamenumber'] = {"N":int(item['gamenumber'])}
        return item