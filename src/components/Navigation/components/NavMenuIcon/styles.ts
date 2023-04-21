import styled, { css, keyframes } from 'styled-components'

import type { NavMenuIconProps } from '../NavMenuIcon'

const rotateToMenuLineA = keyframes`
  0% {
    transform: translate(0, 0) rotate(315deg);
  }
  50% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(0, 0.25rem) rotate(0deg);
  }
`

const rotateToCrossLineA = keyframes`
  0% {
    transform: translate(0, 0.25rem) rotate(0deg);
  }
  50% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(0, 0) rotate(315deg);
  }
`

const rotateToMenuLineB = keyframes`
  0% {
    transform: translate(0, 0) rotate(225deg);
  }
  50% {
    width: 100%;
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    width: 66.6666%;
    transform: translate(0, -0.25rem) rotate(0deg);
  }
`

const rotateToCrossLineB = keyframes`
  0% {
    width: 66.6666%;
    transform: translate(0, -0.25rem) rotate(0deg);
  }
  50% {
    width: 100%;
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(0, 0) rotate(225deg);
  }
`

export const NavMenuIconBase = styled.button<NavMenuIconProps>`
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  padding: 0;
  width: ${({ theme }) => theme.sizes.sm};
  height: ${({ theme }) => theme.sizes.sm};

  &:before,
  &:after {
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    background-color: ${({ theme }) => theme.colors.body};
    transition: background-color 300ms;
  }

  &:active,
  &:hover {
    &:before,
    &:after {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }

  ${({ isActive }) =>
    isActive
      ? css`
          &:before {
            width: 100%;
            transform: translate(0, 0) rotate(225deg);
            animation: 600ms ${rotateToCrossLineB} ease-in;
          }

          &:after {
            transform: translate(0, 0) rotate(315deg);
            animation: 600ms ${rotateToCrossLineA} ease-in;
          }
        `
      : css`
          &:before {
            width: 60%;
            transform: translate(0, -0.25rem) rotate(0deg);
            animation: 600ms ${rotateToMenuLineB} ease-out;
          }

          &:after {
            transform: translate(0, 0.25rem) rotate(0deg);
            animation: 600ms ${rotateToMenuLineA} ease-out;
          }
        `};

  > span {
    display: none;
  }
`
