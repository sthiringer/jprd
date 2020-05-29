import scrapy
import unicodedata


class QuestionsSpider(scrapy.Spider):
    name = "questions"
    start_urls = [
        'http://www.j-archive.com/listseasons.php'
    ]

    def parse(self, response):
        for href in response.xpath('//*[@id="content"]/table/tr/td/a/@href').getall():
            yield response.follow(href, self.parse_season)

    def parse_season(self, response):
        season = response.xpath('//*[@id="content"]/h2/descendant-or-self::*/text()').get().replace("Season ", "")
        numbers_list = response.xpath('//*[@id="content"]/table/tr/td[@align="left"]/a/text()').getall()
        for i, href in enumerate(response.xpath('//*[@id="content"]/table/tr/td[@align="left"]/a/@href').getall()):
            number_and_date_string = unicodedata.normalize("NFKD", numbers_list[i]).split(", aired ")
            game_number = number_and_date_string[0].replace("#", "")
            air_date = number_and_date_string[1]
            metadata = {
                "season": season,
                "game_number": game_number,
                "air_date" : air_date
            }
            yield response.follow(href, self.parse_question, meta=metadata)

    def parse_question(self, response):
        # Prepare constant data for each game
        category_list = ["".join(i.xpath('./descendant-or-self::*/text()').getall()) for i in response.xpath('//*[contains(@id, "jeopardy_round")]/table/tr/td[@class="category"]/table/tr/td[@class="category_name"]')]

        for i, question in enumerate(response.xpath('//*[contains(@id, "jeopardy_round")]/table/tr/td[@class="clue"]')):
            # Prepare data that needs reference to table position ('i' variable here)
            if i < 30:
                category = category_list[i % 6]
            elif i < 60:
                category = category_list[i % 6 + 6]
            else:
                category = category_list[12]

            # Send that and entire question response to cleaner pipeline for processing
            yield{
                'airdate': response.meta['air_date'],
                'season': response.meta['season'],
                'gamenumber': response.meta['game_number'],
                'pos' : i,
                'category' : category,
                'question': question
            }
