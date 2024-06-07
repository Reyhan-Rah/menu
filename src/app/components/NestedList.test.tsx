import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NestedList from "./NestedList";

describe("NestedList Component", () => {
  test("renders the component and initial items", () => {
    render(<NestedList />);

    expect(screen.getByText("Nested List Example")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Add Top-Level Item")).toBeInTheDocument();
  });

  test("adds a top-level item", () => {
    render(<NestedList />);

    fireEvent.click(screen.getByText("Add Top-Level Item"));

    expect(screen.getByText("New Item")).toBeInTheDocument();
  });

  test("adds a child item", () => {
    render(<NestedList />);

    const addChildButtons = screen.getAllByText("Add Child");
    fireEvent.click(addChildButtons[0]); // Add child to "Item 1"

    expect(screen.getByText("New Child")).toBeInTheDocument();
  });

  test("edits an item name", () => {
    render(<NestedList />);

    fireEvent.click(screen.getByText("Item 1")); // Click to edit

    const input = screen.getByDisplayValue("Item 1");
    fireEvent.change(input, { target: { value: "Updated Item 1" } });
    fireEvent.blur(input); // Blur to save

    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.getByText("Updated Item 1")).toBeInTheDocument();
  });

  test("adds a nested item up to a maximum level of 3", () => {
    render(<NestedList />);

    fireEvent.click(screen.getAllByText("Add Child")[0]);
    fireEvent.click(screen.getAllByText("Add Child")[1]);
    fireEvent.click(screen.getAllByText("Add Child")[2]);

    // No more "Add Child" buttons after the third level
    expect(screen.getAllByText("New Child")[2].nextSibling).toBe(null);
  });
});
