import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../src/components/Login";
import Signup from "../src/components/Signup";
import NavBar from "../src/components/NavBar";
import { enableFetchMocks } from "jest-fetch-mock";
import { jest, expect, describe, beforeEach, test } from "@jest/globals";

enableFetchMocks();

const dummyTeacherUser = {
  username: "teacher",
  password: "abcd",
  is_teacher: true,
};

window.alert = jest.fn();
delete window.location;
window.location = { href: "" };

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  test("properly handles the server saying the username is taken", async () => {
    // setup failure response
    fetch.mockResponse(JSON.stringify({ message: "Username already exists" }), {
      status: 400,
    });

    render(<Signup />);

    //fill page
    const username = screen.getByLabelText("Username:");
    fireEvent.change(username, { target: { value: "teacher" } });
    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, { target: { value: "1234" } });
    const teacherButton = screen.getByLabelText("Teacher");
    fireEvent.click(teacherButton);

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // wait for mock fetch to resolve
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/account/register"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );

    // wait for failure message
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Registration failed: Error: Username already exists"
      )
    );
  });

  test("submits valid new user to database", async () => {
    // setup success response
    fetch.mockResponse(JSON.stringify({ id: "123" }), { status: 201 });

    render(<Signup />);

    //fill page
    const username = screen.getByLabelText("Username:");
    fireEvent.change(username, {
      target: { value: dummyTeacherUser.username },
    });
    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, {
      target: { value: dummyTeacherUser.password },
    });
    const teacherButton = screen.getByLabelText("Teacher");
    fireEvent.click(teacherButton);

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // wait for mock fetch to resolve
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/account/register"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
    // wait for success message
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Registered successfully!")
    );

    // wait for mock fetch to resolve
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/account/login"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      )
    );

    // wait for success redirect
    await waitFor(() => expect(window.location.href).toMatch("/"));
  });

  test("will not try to register a user if username was not provided", async () => {
    render(<Signup />);

    //fill page
    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, { target: { value: "1234" } });
    const teacherButton = screen.getByLabelText("Teacher");
    fireEvent.click(teacherButton);

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // expect form to block this attempt
    expect(fetch).not.toHaveBeenCalled();
  });

  test("will not try to register a user if password was not provided", async () => {
    render(<Signup />);

    //fill page
    const username = screen.getByLabelText("Username:");
    fireEvent.change(username, { target: { value: "user" } });
    const teacherButton = screen.getByLabelText("Teacher");
    fireEvent.click(teacherButton);

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // expect form to block this attempt
    expect(fetch).not.toHaveBeenCalled();
  });

  test("will not try to register a user if student vs teacher was not provided", async () => {
    render(<Signup />);

    //fill page
    const username = screen.getByLabelText("Username:");
    fireEvent.change(username, { target: { value: "user" } });
    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, { target: { value: "1234" } });

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // expect form to block this attempt
    expect(fetch).not.toHaveBeenCalled();
  });
});

jest.clearAllMocks();
fetch.resetMocks();

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  test("properly notifies user if login failed", async () => {
    //setup failure response
    fetch.mockResponse(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });

    render(<Login />);

    //fill page
    const username = screen.getByLabelText("Username:");
    fireEvent.change(username, { target: { value: "someone" } });
    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, { target: { value: "abcd" } });

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // wait for mock fetch to resolve
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/account/login"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      )
    );

    // wait for failure message
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Your login attempt failed. Please check your credentials and try again."
      )
    );
  });

  test("handles login correctly if authentication succeeds", async () => {
    //setup success response
    fetch.mockResponse(
      JSON.stringify({ userId: 1, username: "student", isTeacher: false }),
      { status: 201 }
    );

    render(<Login />);

    //fill page
    const username = screen.getByLabelText("Username:");
    fireEvent.change(username, { target: { value: "student" } });
    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, { target: { value: "1234" } });

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // wait for mock fetch to resolve
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/account/login"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      )
    );
    // wait for success redirect
    await waitFor(() => expect(window.location.href).toMatch("/"));
  });

  test("will not attempt login for empty username", async () => {
    render(<Login />);

    //fill page
    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, { target: { value: "1234" } });

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // expect form to block this attempt
    expect(fetch).not.toHaveBeenCalled();
  });

  test("will not attempt login for empty password", async () => {
    render(<Login />);

    //fill page
    const username = screen.getByLabelText("Username:");
    fireEvent.change(username, { target: { value: "user" } });

    //submit
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // expect form to block this attempt
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Shows all accessible pages when logged in", async () => {
    await act(async () => {
      render(<NavBar loggedIn={true} />);
    });

    const home = screen.getByText("Home");
    expect(home).toBeInTheDocument();
    const classes = screen.getByText("Classes");
    expect(classes).toBeInTheDocument();
    const shop = screen.getByText("Shop");
    expect(shop).toBeInTheDocument();
    const logout = screen.getByText("Logout");
    expect(logout).toBeInTheDocument();
    const login = screen.queryByText("Login");
    expect(login).not.toBeInTheDocument();
  });

  test("Shows only login and home pages when logged out", async () => {
    await act(async () => {
      render(<NavBar loggedIn={false} />);
    });

    const home = screen.getByText("Home");
    expect(home).toBeInTheDocument();
    const login = screen.getByText("Login");
    expect(login).toBeInTheDocument();
    const classes = screen.queryByText("Classes");
    expect(classes).not.toBeInTheDocument();
    const shop = screen.queryByText("Shop");
    expect(shop).not.toBeInTheDocument();
    const logout = screen.queryByText("Logout");
    expect(logout).not.toBeInTheDocument();
  });
});
