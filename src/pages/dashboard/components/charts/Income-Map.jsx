import React from "react";
import PropTypes from "prop-types";
import { Sankey, makeWidthFlexible, Hint } from "react-vis";

const FlexibleSankey = makeWidthFlexible(Sankey);

class IncomeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: null
    };
  }

  renderHint() {
    const { activeLink } = this.state;
    const x =
      activeLink.source.x1 + (activeLink.target.x0 - activeLink.source.x1) / 2;
    const y = activeLink.y0 - (activeLink.y0 - activeLink.y1) / 2;
    const amount = `$${parseFloat(
      activeLink.value.toFixed(2)
    ).toLocaleString()}`;
    const hint = {
      [`${activeLink.source.name} ➞ ${activeLink.target.name}`]: amount
    };
    return <Hint x={x} y={y} value={hint} />;
  }

  getNodes() {
    return [
      {
        name: "income"
      },
      {
        name: "expenses"
      },
      {
        name: "savings"
      }
    ]
      .concat(
        this.props.incomeTypes.map(type => {
          return { name: type.subcategory };
        })
      )
      .concat(
        this.props.expensesBySubcategory.map(expense => {
          return { name: expense.category };
        })
      )
      .concat(
        this.props.expensesBySubcategory
          .filter(expense => expense.category === "investments")
          .map(categoryExpense => {
            return categoryExpense.subcategories.map(subcategoryExpense => {
              return {
                name: subcategoryExpense.subcategory
              };
            });
          })
          .reduce((x, y) => x.concat(...y), [])
      );
  }

  getLinks(nodes) {
    const totalIncome = this.props.incomeTypes.reduce((x, y) => {
      return x + y.currentYear;
    }, 0);
    const totalExpenses = this.props.expensesBySubcategory
      .filter(expense => expense.category !== "investments")
      .reduce((x, y) => x.concat(...y.subcategories), [])
      .reduce((x, y) => x + y.currentYear, 0);
    const totalInvestments = this.props.expensesBySubcategory
      .filter(expense => expense.category === "investments")
      .reduce((x, y) => x.concat(...y.subcategories), [])
      .reduce((x, y) => x + y.currentYear, 0);
    return this.props.incomeTypes
      .map(type => {
        return {
          source: nodes.map(node => node.name).indexOf(type.subcategory),
          target: nodes.map(node => node.name).indexOf("income"),
          color: "#71B3FD",
          value: type.currentYear
        };
      })
      .concat([
        {
          source: nodes.map(node => node.name).indexOf("income"),
          target: nodes.map(node => node.name).indexOf("expenses"),
          color: "#F9A943",
          value: totalExpenses
        }
      ])
      .concat([
        {
          source: nodes.map(node => node.name).indexOf("income"),
          target: nodes.map(node => node.name).indexOf("investments"),
          color: "#F0ED36",
          value: totalInvestments
        }
      ])
      .concat([
        {
          source: nodes.map(node => node.name).indexOf("income"),
          target: nodes.map(node => node.name).indexOf("savings"),
          color: "#75FD71",
          value: totalIncome - totalExpenses - totalInvestments
        }
      ])
      .concat(
        this.props.expensesBySubcategory
          .filter(expense => expense.category !== "investments")
          .map(expense => {
            return {
              source: nodes.map(node => node.name).indexOf("expenses"),
              target: nodes.map(node => node.name).indexOf(expense.category),
              color: "#F9A943",
              value: expense.subcategories.reduce(
                (x, y) => x + y.currentYear,
                0
              )
            };
          })
      )
      .concat(
        this.props.expensesBySubcategory
          .filter(expense => expense.category === "investments")
          .map(category => {
            return category.subcategories.map(expense => {
              return {
                source: nodes.map(node => node.name).indexOf("investments"),
                target: nodes
                  .map(node => node.name)
                  .indexOf(expense.subcategory),
                color: "#F0ED36",
                value: expense.currentYear
              };
            });
          })
          .reduce((x, y) => x.concat(...y), [])
      );
  }

  render() {
    if (!this.props.incomeTypes.length) {
      return <div />;
    }
    const nodes = this.getNodes();
    const links = this.getLinks(nodes);
    return (
      <div className="income-map">
        <div className="title">income allocation last year</div>
        <div>
          <FlexibleSankey
            nodes={nodes}
            links={links}
            height={600}
            style={{
              strokeWidth: 0,
              links: {
                opacity: 0.3
              },
              labels: {
                color: "white",
                fill: "white"
              },
              rects: {
                strokeWidth: 0,
                fill: "transparent"
              }
            }}
            onLinkMouseOver={node => this.setState({ activeLink: node })}
            onLinkMouseOut={() => this.setState({ activeLink: null })}
          >
            {this.state.activeLink && this.renderHint()}
          </FlexibleSankey>
        </div>
      </div>
    );
  }
}

IncomeMap.propTypes = {
  incomeTypes: PropTypes.array.isRequired,
  expensesBySubcategory: PropTypes.array.isRequired
};

export default IncomeMap;
