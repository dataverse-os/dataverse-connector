import React, { ReactNode } from "react";

export enum Layout {
  horizontal,
  verticle
}

export function RenderObjectRecursively({
  object,
  layout = Layout.verticle
}: {
  object: object;
  layout?: Layout;
}) {
  return (
    <>
      {Object.entries(object).map(([key, value]) => {
        if (layout === Layout.verticle) {
          return (
            <ul key={key}>
              {key}:{" "}
              {
                (() => {
                  if (value && typeof value === "object")
                    return (
                      <RenderObjectRecursively object={value} layout={layout} />
                    );
                  return typeof value === "bigint" ? Number(value) : value;
                })() as ReactNode
              }
            </ul>
          );
        } else {
          return (
            <span key={key}>
              {" "}
              {key}:{" "}
              {
                (() => {
                  if (value && typeof value === "object")
                    return (
                      <RenderObjectRecursively object={value} layout={layout} />
                    );
                  return typeof value === "bigint" ? Number(value) : value;
                })() as ReactNode
              }
            </span>
          );
        }
      })}
    </>
  );
}
