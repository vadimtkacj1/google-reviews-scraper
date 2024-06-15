const puppeteer = require("puppeteer");

const url =
  "https://www.google.com/maps/place/Shea%C2%B4s+Kitchen/@37.1100736,-1.8465326,17z/data=!4m8!3m7!1s0xd7ad7fafaf43d49:0xf62b13fabda3ce01!8m2!3d37.1100693!4d-1.8439577!9m1!1b1!16s%2Fg%2F11bwy_ywsz?entry=ttu";
const language = "en";

const scrapGoogleReviews = async (url, language) => {
  const LANGUAGES = {
    es: "es",
    en: "en-US, en;q=0.9, es;q=0.8",
  };
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1024 });

  await page.setExtraHTTPHeaders({
    "Accept-Language": LANGUAGES[language],
  });

  await page.goto(url);

  const buttons = await page.$$(".g88MCb");
  const sortButton = buttons[2];
  await sortButton.click();

  await page.waitForSelector("#action-menu");
  await page.click('.fxNQSd[data-index="2"]');

  await page.evaluate(() =>
    document.querySelector(".DxyBCb").scrollTo(0, document.body.scrollHeight)
  );

  await page.evaluate(async () => {
    await new Promise(function (resolve) {
      setTimeout(resolve, 1500);
    });
  });

  await page.waitForSelector(".jftiEf");
  await page.waitForSelector(".w8nwRe");

  const moreInformationButtons = await page.$$(".w8nwRe");

  for (const moreInformationButton of moreInformationButtons) {
    await moreInformationButton.click();
  }

  const reviews = await page.evaluate(() => {
    const users = [];

    const reviewsElements = Array.from(document.querySelectorAll(".jftiEf"));

    reviewsElements.forEach((element) => {
      const textElement = element.querySelector(".wiI7pd");

      const name = element.querySelector(".d4r55").textContent;
      const avatar = element.querySelector(".NBa7we").src;
      const text = textElement ? textElement.textContent : null;
      const rate = element
        .querySelector(".kvMYJc")
        .getAttribute("aria-label")
        .split(" ")[0];
      const publishTime = element.querySelector(".rsqaWe").textContent;

      const user = {
        name: name,
        avatar: avatar,
        text: text,
        rate: rate,
        publishTime: publishTime,
      };

      users.push(user);
    });

    return users;
  });

  console.log(reviews);
  console.log(reviews.length);

  await browser.close();
};

scrapGoogleReviews(url, language);
