// Table Component
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 2px solid #eff1f3;
`;

const Body = styled.tbody``;

const Row = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const Header = styled.th`
  border: 1px solid #ddd;
  color: #000000;
  text-align: left;
  font-weight: 600;
  font-size: 15px;
  line-height: 17px;
  padding: 8px;
`;

const Content = styled.td`
  border: 1px solid #ddd;
  color: #000000;
  font-size: 14px;
  line-height: 16px;
  padding: 8px;
`;

// TableDynamicContent Component
const TableDynamicContent = ({ children }) => {
  // eslint-disable-line
  return (
    <Row>
      {children.map((row) => (
        <RowItem row={row} />
      ))}
    </Row>
  );
};

// RowItem Component
const RowItem = ({ row }) => {
  // eslint-disable-line
  return <Content>{row}</Content>;
};

// TableContentComponent Component
const TableContentComponent = ({ children }) => {
  return <Content>{children}</Content>;
};

// TableHeader Component
const TableHeaderComponent = ({ title }) => {
  return <Header>{title}</Header>;
};

// TableRow Component
const TableRowComponent = ({ children }) => {
  return <Row>{children}</Row>;
};

// TableBody Component
const TableBody = (props) => {
  const { children } = props;

  return <Body>{children}</Body>;
};

// Main Component
const Table = (props) => {
  const { children } = props;

  return <Wrapper>{children}</Wrapper>;
};

Table.TableRow = TableRowComponent;
Table.TableHeader = TableHeaderComponent;
Table.TableContent = TableContentComponent;
Table.TableDynamicContent = TableDynamicContent;
Table.TableBody = TableBody;

Table.propTypes = {
  children: PropTypes.node
};

Table.defaultProps = {
  children: null
};

export default Table;
