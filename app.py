
import sqlalchemy
from sqlalchemy.sql import text
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template, redirect

# create engine
engine = create_engine('postgresql://admin22:12345@localhost:5432/saccrewproject2')
session = Session(engine)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
# Save reference to the table
walmartdata = Base.classes.walmartdata

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route('/api/datacall')
def jsonifyData():
    results = engine.execute('SELECT * FROM walmartdata').fetchall()
    return jsonify([dict(row) for row in results])


# This route will pull the data for get the counts of products for each category
@app.route("/api/categorycounts")
def getcategorycounts():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Grab All the data
    results=session.query(
        walmartdata.category,
        func.count(walmartdata.item_number)
        ).\
        group_by(walmartdata.category)
    session.close()

    # Create a dictionary from the row data and append to a list of all_sqldata
    all_sqldata = []
    for cat, total in results:
        sql_dict = {}
        sql_dict["Category"] = cat
        sql_dict["Item_Count"] = total
        all_sqldata.append(sql_dict)

    return jsonify(all_sqldata)


# Add any additional queries here
@app.route("/api/categoryavgprice")
def getcategoryavg():
    # Create our session (link) from Python to the DB
    session = Session(engine)

# Grab All the data
    results=session.query(
        walmartdata.category,
        func.avg(walmartdata.price_2019),
        func.avg(walmartdata.price_2020),
        ).\
        group_by(walmartdata.category)

    session.close()

    # Create a dictionary from the row data and append to a list of all_sqldata
    all_sqldata = []
    for cat, avg19, avg20 in results:
        sql_dict = {}
        sql_dict["Category"] = cat
        sql_dict["2019_avg"] = avg19
        sql_dict["2020_avg"] = avg20
        all_sqldata.append(sql_dict)

    return jsonify(all_sqldata)

@app.route("/api/toptenpriceincrease")
def topten():
    # Create our session (link) from Python to the DB
    session = Session(engine)

# Grab All the data
    results=session.query(
        walmartdata.product_name,
        walmartdata.category,
        walmartdata.price_difference
        ).\
        order_by((walmartdata.price_difference).desc()).limit(10)

    session.close()

    # Create a dictionary from the row data and append to a list of all_sqldata
    all_sqldata = []
    for name, category, pricediff in results:
        sql_dict = {}
        sql_dict["ProductName"] = name
        sql_dict["Category"] = category
        sql_dict["PriceDiff"] = pricediff
        all_sqldata.append(sql_dict)

    return jsonify(all_sqldata)

@app.route("/api/toptenpricedecrease")
def lowerten():
    # Create our session (link) from Python to the DB
    session = Session(engine)

# Grab All the data
    results=session.query(
        walmartdata.product_name,
        walmartdata.category,
        walmartdata.price_difference
        ).\
        order_by((walmartdata.price_difference)).limit(10)

    session.close()

    # Create a dictionary from the row data and append to a list of all_sqldata
    all_sqldata = []
    for name, category, pricediff in results:
        sql_dict = {}
        sql_dict["ProductName"] = name
        sql_dict["Category"] = category
        sql_dict["PriceDiff"] = pricediff
        all_sqldata.append(sql_dict)

    return jsonify(all_sqldata)

if __name__ == "__main__":
    app.run(debug=True)

