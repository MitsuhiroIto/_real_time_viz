from bokeh.io import curdoc
from bokeh.models import ColumnDataSource, DatetimeTickFormatter
from bokeh.plotting import figure
from urllib import request
from bs4 import BeautifulSoup
from datetime import datetime
from math import radians
from pytz import timezone

def get_data():
    URL = "https://stocks.finance.yahoo.co.jp/stocks/detail/?code=^DJI"
    html = request.urlopen(URL)
    soup = BeautifulSoup(html, "html.parser")
    return int(float(soup.find_all(class_="stoksPrice")[1].text.replace(',', '')))

def update_data():
    now = datetime.now(tz=timezone("Asia/Tokyo"))
    new_data = dict(x=[now], y=[get_data()])
    source.stream(new_data, rollover=200)

#データソースの作成
source = ColumnDataSource(dict(x=[], y=[]))

#グラフの作成
fig = figure(x_axis_type="datetime",
             x_axis_label="Datetime",
             y_axis_label="ダウ平均株価[dollar]",
             plot_width=800,
             plot_height=600)
fig.title.text = "NYダウCFD リアルタイムチャート"
fig.line(source=source, x="x", y="y", line_width=2, alpha=.85, color="blue")
fig.circle(source=source, x="x", y="y", line_width=2, color="blue")

#軸の設定
format = "%Y-%m-%d-%H-%M-%S"
fig.xaxis.formatter = DatetimeTickFormatter(
    seconds=[format],
    minsec =[format],
    minutes=[format],
    hourmin=[format],
    hours  =[format],
    days   =[format],
    months =[format],
    years  =[format]
)
fig.xaxis.major_label_orientation=radians(90)

#コールバックの設定
curdoc().add_root(fig)
curdoc().add_periodic_callback(update_data, 3000) #ms単位