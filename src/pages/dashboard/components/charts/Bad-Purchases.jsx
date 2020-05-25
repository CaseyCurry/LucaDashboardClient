import React from "react";
import PropTypes from "prop-types";
import {
  DiscreteColorLegend,
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  Hint
} from "react-vis";

class BadPurchases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hint: false
    };
  }

  renderX(value) {
    const year = value.getFullYear().toString();
    return (
      <tspan>
        <tspan x="0" dy="1em">
          {year}
        </tspan>
        <tspan x="0" dy="1em">
          {`$${this.props.purchases.years[year].toLocaleString()}`}
        </tspan>
      </tspan>
    );
  }

  renderY(value) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][value];
  }

  renderHint() {
    const value = { x: this.state.hint.x, y: this.state.hint.y };
    return (
      <Hint value={value}>
        <div>
          <div>${this.state.hint.purchase.amount.toLocaleString()}</div>
          <div>{this.state.hint.purchase.categorization.category}</div>
          <div>{this.state.hint.purchase.categorization.subcategory}</div>
          <div>
            {new Date(this.state.hint.purchase.date).toLocaleDateString("en", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
          </div>
        </div>
      </Hint>
    );
  }

  render() {
    const colors = [
      ["#46D61F", "#46D61F"], // green
      ["#FEFE11", "#FEFE11"], // yellow
      ["#5DADE2", "#5DADE2"], // blue
      ["#C738F9", "#C738F9"], // purple
      ["#FF6619", "#FF6619"], // orange
      ["#2CE7D9", "#2CE7D9"], // turquiose
      ["#E72C48", "#E72C48"], // red
      ["#2C37E7", "#2C37E7"], // blue
      ["#8DC690", "#8DC690"], // green
      ["#CDC820", "#CDC820"] // yellow
    ];

    const categories = this.props.purchases.details.reduce((x, purchase) => {
      const key = purchase.categorization.category;
      if (!x[key]) {
        x[key] = {
          purchases: [],
          colors: colors.shift(),
          balance: 0
        };
      }
      x[key].balance += purchase.amount;
      x[key].purchases.push({
        x: new Date(purchase.date),
        y: new Date(purchase.date).getDay(),
        size: purchase.amount,
        color: 0,
        opacity: 0.7,
        purchase
      });
      return x;
    }, {});

    return (
      <div className="bad-purchases">
        <div className="title">bad purchases</div>
        <div className="content row">
          <div className="col-12 col-sm-4 col-lg-2">
            <DiscreteColorLegend
              items={Object.keys(categories).map(category => {
                return {
                  title: `${category} $${categories[
                    category
                  ].balance.toLocaleString()}`,
                  color: categories[category].colors[0],
                  strokeWidth: 15
                };
              })}
            />
          </div>
          <div className="col-12 col-sm-8 col-lg-10">
            <FlexibleWidthXYPlot
              onMouseLeave={() => this.setState({ hint: false })}
              height={300}
              margin={40}
              xType="time"
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis
                tickFormat={value => this.renderX(value)}
                tickTotal={Object.keys(this.props.purchases.years).length}
              />
              <YAxis tickFormat={value => this.renderY(value)} />
              {Object.keys(categories).map(category => {
                return (
                  <MarkSeries
                    key={category}
                    animation={true}
                    sizeRange={[3, 30]}
                    colorRange={categories[category].colors}
                    opacityType="literal"
                    data={categories[category].purchases}
                    onValueMouseOver={value => this.setState({ hint: value })}
                  />
                );
              })}
              {this.state.hint && this.renderHint()}
            </FlexibleWidthXYPlot>
          </div>
        </div>
      </div>
    );
  }
}

BadPurchases.propTypes = {
  purchases: PropTypes.object.isRequired
};

export default BadPurchases;
