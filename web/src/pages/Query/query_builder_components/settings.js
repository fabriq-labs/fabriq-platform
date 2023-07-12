import React, { useState } from "react";
import { Divider, InputNumber, Spin, Button, Popover, Typography } from "antd";

import Axes from "./axes";
import Options from "./options";
import OrderGroup from "./order_group";

export default function Settings({
  pivotConfig,
  orderMembers,
  limit: initialLimit,
  disabled,
  onMove,
  onUpdate,
  onReorder,
  onOrderChange,
  isQueryPresent
}) {
  const [limit, setLimit] = useState(initialLimit);
  const [isLimitPopoverVisible, setIsLimitPopoverVisible] = useState(false);

  return (
    <>
      <Typography.Text style={{ alignSelf: "center" }}>
        Settings:
      </Typography.Text>
      <Popover
        content={
          pivotConfig === null ? (
            <Spin />
          ) : (
            <div data-testid="pivot-popover">
              <Axes pivotConfig={pivotConfig} onMove={onMove} />
              <Divider style={{ margin: 0 }} />
              <div style={{ padding: "8px" }}>
                <Options pivotConfig={pivotConfig} onUpdate={onUpdate} />
              </div>
            </div>
          )
        }
        placement="bottomLeft"
        trigger="click"
      >
        <Button
          data-testid="pivot-btn"
          disabled={!isQueryPresent || disabled}
          style={{ border: 0 }}
        >
          Pivot
        </Button>
      </Popover>
      <Popover
        content={
          <div
            style={{
              padding: "8px",
              paddingBottom: 1
            }}
          >
            <OrderGroup
              orderMembers={orderMembers}
              onReorder={onReorder}
              onOrderChange={onOrderChange}
            />
          </div>
        }
        placement="bottomLeft"
        trigger="click"
      >
        <Button
          data-testid="order-btn"
          disabled={!isQueryPresent || disabled}
          style={{ border: 0 }}
        >
          Order
        </Button>
      </Popover>
      <Popover
        visible={isLimitPopoverVisible}
        content={
          <div style={{ padding: "8px" }}>
            <label>
              Limit{" "}
              <InputNumber
                prefix="Limit"
                type="number"
                value={limit}
                step={500}
                onChange={setLimit}
                onPressEnter={() => {
                  onUpdate({ limit });
                  setIsLimitPopoverVisible(false);
                }}
              />
            </label>
          </div>
        }
        placement="bottomLeft"
        trigger="click"
        onVisibleChange={(visible) => {
          setIsLimitPopoverVisible(visible);

          if (!visible) {
            onUpdate({ limit });
          }
        }}
      >
        <Button
          data-testid="limit-btn"
          disabled={!isQueryPresent || disabled}
          style={{ border: 0 }}
        >
          Limit
        </Button>
      </Popover>
    </>
  );
}
