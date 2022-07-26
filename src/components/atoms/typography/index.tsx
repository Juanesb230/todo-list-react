import styled from 'styled-components'
import { COLORS } from '../../../shared/theme/colors'

interface TypographyProps {
  fontSize?: string
  fontWeight?: string
  color?: string
  align?: string
  lineHeight?: string;
  textDecoration?: string
}

const Typography = styled.div<TypographyProps>`
  font-size: ${({ fontSize }) => fontSize ? fontSize + 'px' : '16px'};
  font-weight: ${({ fontWeight = '400' }) => fontWeight };
  color: ${({ color }) => color ? color : COLORS.textColor2};
  text-align: ${({ align }) => align};
  line-height:  ${({ lineHeight }) => lineHeight ? lineHeight + 'px' : '24px'};
  text-decoration: ${({ textDecoration = 'none' }) => textDecoration};
`

export default Typography
