import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Shop from "../src/components/Shop";
import { enableFetchMocks } from "jest-fetch-mock";
import { jest, expect, describe, beforeEach, test } from "@jest/globals";

enableFetchMocks();

const dummyRewardsData = [
  {
    reward_name: "Inchworm Avatar",
    reward_type_id: 1,
    description: "An avatar for all users.",
    point_cost: 0,
    acquisition_date: 1,
    active: false,
  },
  {
    reward_name: "Sample Title 1",
    reward_type_id: 2,
    description: "An avatar for all users.",
    point_cost: 0,
    acquisition_date: 1,
    active: true,
  },
  {
    reward_name: "Sample Title 2",
    reward_type_id: 2,
    description: "An avatar for all users.",
    point_cost: 50,
    acquisition_date: null,
    active: false,
  },
  {
    reward_name: "Books Theme",
    reward_type_id: 3,
    description: "Roughly drawn books.",
    point_cost: 300,
    acquisition_date: null,
    isActive: false,
  },
];

const dummyPointsData = {
  points: 200,
};

// Mock alert
window.alert = jest.fn();
// Mock confirm
window.confirm = jest.fn(() => {
  return true;
});
// Mock global.location
delete window.location;
window.location = { href: "" };

describe("Shop Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify(dummyRewardsData), { status: 200 });
    fetch.mockResponseOnce(JSON.stringify(dummyPointsData), { status: 200 });
  });

  test("shows sidebar with correct active rewards", async () => {
    await act(async () => {
      render(<Shop username="user" />);
    });

    // Get the side bar element and make sure all the contents have the correct values
    const user = screen.getByText("user");
    expect(user).toBeInTheDocument();
    const title1 = screen.queryByRole("heading", {
      level: 2,
      name: dummyRewardsData[1].reward_name,
    }); //disambiguates from shop listing version
    expect(title1).toBeInTheDocument();
    const points = screen.getByText("200");
    expect(points).toBeInTheDocument();
  });

  test("shows only avatars on the avatars panel", async () => {
    await act(async () => {
      render(<Shop username="test" />);
    });

    //check existence of all the rewards, only avatars should appear
    const avatar = screen.getByText(dummyRewardsData[0].reward_name);
    expect(avatar).toBeInTheDocument();
    const title1 = screen.queryByRole("heading", {
      level: 3,
      name: dummyRewardsData[1].reward_name,
    }); //disambiguates from sidebar version
    expect(title1).not.toBeInTheDocument();
    const title2 = screen.queryByText(dummyRewardsData[2].reward_name);
    expect(title2).not.toBeInTheDocument();
    const theme = screen.queryByText(dummyRewardsData[3].reward_name);
    expect(theme).not.toBeInTheDocument();
  });

  test("shows only titles on the titles panel", async () => {
    await act(async () => {
      render(<Shop username="test" />);
    });

    const titlesButton = screen.getByText("Titles");
    fireEvent.click(titlesButton);

    //check existence of all the rewards, only titles should appear
    const avatar = screen.queryByText(dummyRewardsData[0].reward_name);
    expect(avatar).not.toBeInTheDocument();
    const title1 = screen.queryByRole("heading", {
      level: 3,
      name: dummyRewardsData[1].reward_name,
    }); //disambiguates from sidebar version
    expect(title1).toBeInTheDocument();
    const title2 = screen.queryByText(dummyRewardsData[2].reward_name);
    expect(title2).toBeInTheDocument();
    const theme = screen.queryByText(dummyRewardsData[3].reward_name);
    expect(theme).not.toBeInTheDocument();
  });

  test("shows only themes on the themes panel", async () => {
    await act(async () => {
      render(<Shop username="test" />);
    });

    const themesButton = screen.getByText("Themes");
    fireEvent.click(themesButton);

    //check existence of all the rewards, only themes should appear
    const avatar = screen.queryByText(dummyRewardsData[0].reward_name);
    expect(avatar).not.toBeInTheDocument();
    const title1 = screen.queryByRole("heading", {
      level: 3,
      name: dummyRewardsData[1].reward_name,
    }); //disambiguates from sidebar version
    expect(title1).not.toBeInTheDocument();
    const title2 = screen.queryByText(dummyRewardsData[2].reward_name);
    expect(title2).not.toBeInTheDocument();
    const theme = screen.queryByText(dummyRewardsData[3].reward_name);
    expect(theme).toBeInTheDocument();
  });

  test("equip button is shown and enabled for an owned but inactive reward", async () => {
    await act(async () => {
      render(<Shop username="test" />);
    });

    //validate button attributes
    const equipButton = screen
      .getByTestId(dummyRewardsData[0].reward_name + " Container")
      .querySelector("button");
    expect(equipButton).toHaveTextContent("Equip");
    expect(equipButton).toBeEnabled();
  });

  test("equip button is shown but disabled for an owned and active reward", async () => {
    await act(async () => {
      render(<Shop username="test" />);
    });

    // switch to titles panel
    const titlesButton = screen.getByText("Titles");
    fireEvent.click(titlesButton);

    //validate button attributes
    const equipButton = screen
      .getByTestId(dummyRewardsData[1].reward_name + " Container")
      .querySelector("button");
    expect(equipButton).toHaveTextContent("Equip");
    expect(equipButton).not.toBeEnabled();
  });

  test("buy button is shown and enabled for an unowned, affordable reward", async () => {
    await act(async () => {
      render(<Shop username="test" />);
    });

    // switch to titles panel
    const titlesButton = screen.getByText("Titles");
    fireEvent.click(titlesButton);

    //validate button attributes
    const buyButton = screen
      .getByTestId(dummyRewardsData[2].reward_name + " Container")
      .querySelector("button");
    expect(buyButton).toBeEnabled();
    expect(buyButton).toHaveTextContent("Buy");
  });

  test("buy button is shown but disabled for an unowned, unaffordable reward", async () => {
    await act(async () => {
      render(<Shop username="test" />);
    });

    // switch to titles panel
    const themesButton = screen.getByText("Themes");
    fireEvent.click(themesButton);

    //validate button attributes
    const buyButton = screen
      .getByTestId(dummyRewardsData[3].reward_name + " Container")
      .querySelector("button");
    expect(buyButton).toHaveTextContent("Buy");
    expect(buyButton).not.toBeEnabled();
  });

  test("correctly updates display when something gets equipped", async () => {
    //sets up database responses
    const equippedReward = dummyRewardsData[0];
    equippedReward.active = true;
    fetch.mockResponses(
      [JSON.stringify(equippedReward), { status: 200 }],
      [JSON.stringify(equippedReward), { status: 200 }],
      [JSON.stringify(dummyPointsData), { status: 200 }]
    );

    await act(async () => {
      render(<Shop username="test" />);
    });

    // find and click equip button
    const equipButton = screen
      .getByTestId(dummyRewardsData[0].reward_name + " Container")
      .querySelector("button");
    fireEvent.click(equipButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3)); //activate, plus useeffect refresh
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/shop/activate"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  test("correctly updates display when something gets purchased", async () => {
    //sets up database responses
    const purchasedReward = dummyRewardsData[0];
    purchasedReward.active = true;
    fetch.mockResponses(
      [JSON.stringify(purchasedReward), { status: 200 }],
      [JSON.stringify(purchasedReward), { status: 200 }],
      [
        JSON.stringify(dummyPointsData - purchasedReward.point_cost),
        { status: 200 },
      ]
    );

    await act(async () => {
      render(<Shop username="test" />);
    });

    const titlesButton = screen.getByText("Titles");
    fireEvent.click(titlesButton);

    //purchase the reward
    const buyButton = screen
      .getByTestId(dummyRewardsData[2].reward_name + " Container")
      .querySelector("button");
    fireEvent.click(buyButton);

    expect(window.confirm).toHaveBeenLastCalledWith(
      `Are you sure you want to purchase ${dummyRewardsData[2].reward_name} for ${dummyRewardsData[2].point_cost} points?`
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3)); //purchase, plus useeffect refresh
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/shop/purchase"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });
});
