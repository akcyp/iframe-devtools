import { JsonView, darkStyles, defaultStyles } from 'react-json-view-lite';
import { useMemo } from 'react';
import { parseData } from '../../utils/parseData';
import { useDarkMode } from '@src/hooks/useDarkMode';

import classes from './Preview.module.css';
import 'react-json-view-lite/dist/index.css';

const darkTheme = {
  ...darkStyles,
  container: 'background-color: transparent;',
};

const lightTheme = {
  ...defaultStyles,
  container: 'background-color: transparent;',
};

export function Preview({ data }: { data: unknown }) {
  const isDark = useDarkMode();
  const parsedData = useMemo(() => parseData(data), [data]);
  const isJsonData = useMemo(
    () => typeof parsedData === 'object' && parsedData !== null,
    [parsedData],
  );

  return isJsonData ? (
    <div className={classes.json}>
      <JsonView data={parsedData} style={isDark ? darkTheme : lightTheme} />
    </div>
  ) : (
    <pre className={classes.other}>{String(parsedData)}</pre>
  );
}
